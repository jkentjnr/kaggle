'use strict';

var exports = module.exports = {};

var Yakuza = require('yakuza');
var Gurkha = require('gurkha');

var oddsSchema = {
  $rule: '.js-oc-tables-inner',
  time: {
    $rule: '.oc-table__timestamp.timestamp',
    $sanitizer: function ($elem) {
      return $elem.attr('data-utime') * 1000;
    }
  },
  id: {
    $rule: '.oc-table.ocEvent',
    $sanitizer: function ($elem) {
      return $elem.attr('data-event');
    }
  },
  name: '.oc-table__event-name-full',
  type: '.oc-table__event-description',
  entry: {
    $rule: '.oc-table-body .competitor-info__horse-name',
    $sanitizer: function ($elem) {
      return $elem.text().trim();
    }
  },
  agency: {
    $rule: '.oc-table .oc-table-head .agency-logo img',
    $sanitizer: function ($elem) {
      return $elem.attr('title');
    }
  },
  odds: {
    $rule: '.oc-table-cont--right .oc-table-body .oc-table-tr.gutter',
    entry: {
      $rule: '.ppodds'
    },
    $sanitizer: function ($elem) {
      if ($elem.children().length === 0) return '-1';
      return $elem.children('a').text().replace('bet', '').trim();
    }
  }
}

Yakuza.scraper('Odds');
Yakuza.agent('Odds', 'Punters').plan([
  'GetOdds',
  'JoinArticleLinks'
]);

Yakuza.task('Odds', 'Punters', 'GetOdds')
  .builder(function (job) {
    return job.params.jobs.map(function(item) {
      return {
        sport: item.sport,
        group: -1,
        limit: item.limit || 100
      };
    });
  })
  .main(function (task, http, params) {
    var baseUrl, opts;

    baseUrl = 'https://www.punters.com.au/widgets/OddsComparison.php?type=OddsComparison&sport=' + params.sport + '&group=' + params.group + '&limit=' + params.limit + '&searchType=&searchVal1=&searchVal2=';
    console.log('Executing URL:', baseUrl);

    opts = { url: baseUrl };

    http.get(opts).then(function (result) {
      var linkParser = new Gurkha(oddsSchema);
      var event = linkParser.parse(result.body);

      var response = [];
      event.forEach(function(item) {

        if (item.entry.length !== item.odds.length)
          throw new Error('Alignment Error');

        var result = {
          time: new Date(item.time),
          id: item.id,
          sport: params.sport,
          name: item.name,
          type: item.type,
          options: item.odds.map(function(oddList, n) {
            var odds = [];
            oddList.entry.forEach(function(val, i) {
              if (val !== '-1') {
                odds.push({
                  agency: item.agency[i],
                  value: parseFloat(val)
                });
              }
            });
            return {
              name: item.entry[n],
              odds: odds
            };
          })
        }
        response.push(result);
      });      

      task.success(response);
    });
  });

exports.SPORT_TYPE_HORSE_RACING = 1;
exports.SPORT_TYPE_SOCCER = 2;
exports.SPORT_TYPE_AFL = 3;
exports.SPORT_TYPE_RUGBY_LEAGUE = 4;
exports.SPORT_TYPE_RUGBY_UNION = 5;
exports.SPORT_TYPE_CAR_RACING = 6;
exports.SPORT_TYPE_GOLF = 7;
exports.SPORT_TYPE_TENNIS = 8;
exports.SPORT_TYPE_CRICKET = 9;
exports.SPORT_TYPE_BASKETBALL = 10;

exports.getSportType = function(type) {
  switch (type) {
    case exports.SPORT_TYPE_HORSE_RACING: return 'horseRacing';
    case exports.SPORT_TYPE_SOCCER: return 'soccer';
    case exports.SPORT_TYPE_AFL: return 'afl';
    case exports.SPORT_TYPE_RUGBY_LEAGUE: return 'rugbyLeague';
    case exports.SPORT_TYPE_RUGBY_UNION: return 'rugbyUnion';
    case exports.SPORT_TYPE_CAR_RACING: return 'carRacing';
    case exports.SPORT_TYPE_GOLF: return 'golf';
    case exports.SPORT_TYPE_TENNIS: return 'tennis';
    case exports.SPORT_TYPE_CRICKET: return 'cricket';
    case exports.SPORT_TYPE_BASKETBALL: return 'basketball';
    default: throw new Error('Invalid Sport Type');
  }
}

/*
{ jobs: [
    { sport: SPORT_TYPE_SOCCER, limit: 400 },
    { sport: SPORT_TYPE_AFL },
    { sport: SPORT_TYPE_RUGBY_LEAGUE },
    { sport: SPORT_TYPE_RUGBY_UNION },
    { sport: SPORT_TYPE_CAR_RACING },
    { sport: SPORT_TYPE_GOLF },
    { sport: SPORT_TYPE_TENNIS },
    { sport: SPORT_TYPE_CRICKET },
    { sport: SPORT_TYPE_BASKETBALL },
  ]}
*/

exports.getOdds = function(params) {
  return new Promise(function (resolve, reject) {
    var result = { sports: {} };

    var job = Yakuza.job('Odds', 'Punters', params);

    job.on('task:GetOdds:success', function (jobResult) {
      result.sports[exports.getSportType(jobResult.data[0].sport)] = jobResult.data;

      if (Object.keys(result.sports).length === params.jobs.length) {
        resolve(result);
      }
    });

    job.on('task:GetOdds:fail', function (response) {
      reject(response.error);
    });

    job.enqueueTaskArray(['GetOdds']);

    job.run();

  });
}