# nodeSmoke
nodeSmoke is a latency and packet loss capturing tool which is sampling data to InfluxDB.

## Installation

In order to start using `nodeSmoke` simply clone this repository and start the `nodeSmoke.js` file using `nodejs` - although you might want to have it running in the background. Example:

    git clone https://github.com/fbrandstetter/nodeSmoke.git
    cd nodeSmoke/
    nodejs nodeSmoke.js &
    
## Configuration

Any configuration is done within the `nodeSmoke.js` file:

**Storing the hosts**

    var hosts = [
      '8.8.8.8',
      '8.8.4.4',
      '4.2.2.1'
    ];
    
**Setting the ping and influx options**

    var options = {
      'packets':'20',
      'interval':'0.06',
      'influxDB':'grafana'
    };

## WIP

* IPv6 Support
* Error-Handling
