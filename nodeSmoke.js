var exec = require('child_process').exec;

var hosts = [
  '8.8.8.8',
  '8.8.4.4',
  '4.2.2.1',
  '2001:4860:4860::8888'
];

var options = {
  'packets':'20',
  'interval':'0.06',
  'influxDB':'grafana'
};

function capturePing(host, callback) {
  if ( host.split(":").length > 2 ) {
    var ext = 'ping6';
  } else {
    var ext = 'ping';
  }
  exec(ext + " -n -c " + options['packets'] + " -i " + options['interval'] + " " + host, function(error, stdout, stderr) {
    var parseData;
    try {
      parseData = stdout.replace('/(?:\r\n|\r|\n)/g', ";");
      parseLossData = parseData.match('[0-9]% packet loss[^;]*').toString();
      parseLossData = parseLossData.split(",")[0].split("%")[0].trim();
      parseData = parseData.match('rtt(.*?)[^;]*')[0];
      parseData = parseData.split("=");
      parseData = parseData[1].split(",");
      parseData = parseData[0].trim().split("/").toString();
      parseData = parseData.split(" ")[0];
      parseData = parseData.split(",");
      parseData[4] = parseLossData;
    } catch(error) {
      parseData[0] = 0;
      parseData[1] = 0;
      parseData[2] = 0;
      parseData[3] = 0;
      parseData[4] = 100;
    }
    parseData[5] = host;
    callback(parseData);
  });
}

function writeInflux(host, min, avg, max, jitter, loss) {
  exec("curl -i -XPOST 'http://localhost:8086/write?db=" + options['influxDB'] + "' --data-binary 'smokeping,host=" + host.replace(":", "_") + " min=" + min + ",avg=" + avg + ",max=" + max + ",jitter=" + jitter + ",loss=" + loss + "'", function(err, stdout, stderr) {
  });
}

function executePing() {
  for(i = 0; i < hosts.length; i++) {
    capturePing(hosts[i], function(response) {
      writeInflux(response[5], response[0], response[1], response[2], response[3], response[4]);
    });
  }
}

setInterval(executePing, 10000);
