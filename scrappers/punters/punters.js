'use strict';

var fs, Yakuza, job, oddsSchema, Gurkha;

fs = require('fs');
Yakuza = require('yakuza');
Gurkha = require('gurkha');

var SPORT_TYPE_HORSE_RACING = 1;
var SPORT_TYPE_SOCCER = 2;
var SPORT_TYPE_AFL = 3;
var SPORT_TYPE_RUGBY_LEAGUE = 4;
var SPORT_TYPE_RUGBY_UNION = 5;
var SPORT_TYPE_CAR_RACING = 6;
var SPORT_TYPE_GOLF = 7;
var SPORT_TYPE_TENNIS = 8;
var SPORT_TYPE_CRICKET = 9;
var SPORT_TYPE_BASKETBALL = 10;

oddsSchema = {
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
    return job.params.sport.map(function(sport) {
      return {
        sport: sport,
        group: -1,
        limit: 100
      };
    });
  })
  .main(function (task, http, params) {
    var baseUrl, opts;

    baseUrl = 'https://www.punters.com.au/widgets/OddsComparison.php?type=OddsComparison&sport=' + params.sport + '&group=' + params.group + '&limit=' + params.limit + '&searchType=&searchVal1=&searchVal2=';
    console.log('URL:', baseUrl);

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


job = Yakuza.job('Odds', 'Punters', {sport: [
  SPORT_TYPE_SOCCER,
  SPORT_TYPE_AFL,
  SPORT_TYPE_RUGBY_LEAGUE,
  SPORT_TYPE_RUGBY_UNION,
  SPORT_TYPE_CAR_RACING,
  SPORT_TYPE_GOLF,
  SPORT_TYPE_TENNIS,
  SPORT_TYPE_CRICKET,
  SPORT_TYPE_BASKETBALL,
]});

job.on('task:GetOdds:success', function (result) {
  console.log('--- Final result ---');
  var filename = 'data_' + result.data[0].sport + '.json';
  fs.writeFileSync('./output/' + filename, JSON.stringify(result.data, null, 4));
});

job.enqueueTaskArray(['GetOdds']);

job.run();