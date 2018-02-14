var fs = require('fs');

var data = { stadiums: [] };

var generateLatLng = function(lat, lng) {
  return {
    lat: lat,
    lng: lng,
  }
}

var makeMarker = function(item) {
  data.stadiums.push({
    team: item.title,
    team: getTeamCode(item.title),
    lat: item.position.lat,
    lng: item.position.lng,
  });
}

var getTeamCode = function(name) {
  switch(name) {
    case 'Atlanta Hawks': return 'ATL';
    case 'Boston Celtics': return 'BOS';
    case 'Brooklyn Nets': return 'BRO';
    case 'Charlotte Bobcats': return 'CHA';
    case 'Chicago Bulls': return 'CHI';
    case 'Cleveland Cavaliers': return 'CLE';
    case 'Dallas Mavericks': return 'DAL';
    case 'Detroit Pistons': return 'DET';
    case 'Denver Nuggets': return 'DEN';
    case 'Golden State Warriors': return 'GSW';
    case 'Houston Rockets': return 'HOU';
    case 'Indiana Pacers': return 'IND';
    case 'Los Angeles Clippers': return 'LAC';
    case 'Los Angeles Lakers': return 'LAL';
    case 'Memphis Grizzlies': return 'MEM';
    case 'Miami Heat': return 'MIA';
    case 'Milwaukee Bucks': return 'MIL';
    case 'Minnesota Timberwolves': return 'MIN';
    case 'New Orleans Pelicans': return 'NOP';
    case 'New York Knicks': return 'NYK';
    case 'New York Knicks': return 'NYK';
    case 'Oklahoma City Thunder': return 'OKL';
    case 'Orlando Magic': return 'ORL';
    case 'Philadelphia 76ers': return 'PHI';
    case 'Phoenix Suns': return 'PHX';
    case 'Portland Trail Blazers': return 'POR';
    case 'Sacramento Kings': return 'SAC';
    case 'San Antonio Spurs': return 'SAS';
    case 'Toronto Raptors': return 'TOR';
    case 'Utah Jazz': return 'UTA';
    case 'Washington Wizards': return 'WAS';
    default:
      throw new Error(name);
  }
}

makeMarker({
  position: generateLatLng(33.75718252983012,-84.39627796411514),
  title: "Atlanta Hawks",
  sidebardbItem: "Atlanta Hawks",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/atlanta-hawks/'>Atlanta Hawks</a></b><br /><a href='http://www.sportmapworld.com/venue/philips-arena/'>Philips Arena</a>"
});	
makeMarker({
  position: generateLatLng(42.366281167807934,-71.06226593255996),
  title: "Boston Celtics",
  sidebardbItem: "Boston Celtics",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/boston-celtics/'>Boston Celtics</a></b><br /><a href='http://www.sportmapworld.com/venue/td-garden/'>TD Garden</a>"
});	
makeMarker({
  position: generateLatLng(40.68265,-73.974689),
  title: "Brooklyn Nets",
  sidebardbItem: "Brooklyn Nets",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/new-jersey-nets/'>Brooklyn Nets</a></b><br /><a href='http://www.sportmapworld.com/venue/barclays-center/'>Barclays Center</a>"
});	
makeMarker({
  position: generateLatLng(35.224519,-80.841053),
  title: "Charlotte Bobcats",
  sidebardbItem: "Charlotte Bobcats",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/charlotte-bobcats/'>Charlotte Bobcats</a></b><br /><a href='http://www.sportmapworld.com/venue/time-warner-cable-arena/'>Time Warner Cable Arena</a>"
});	
makeMarker({
  position: generateLatLng(41.88058924492546,-87.67414927482605),
  title: "Chicago Bulls",
  sidebardbItem: "Chicago Bulls",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/chicago-bulls/'>Chicago Bulls</a></b><br /><a href='http://www.sportmapworld.com/venue/united-center/'>United Center</a>"
});	
makeMarker({
  position: generateLatLng(41.496667,-81.688056),
  title: "Cleveland Cavaliers",
  sidebardbItem: "Cleveland Cavaliers",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/cleveland-cavaliers/'>Cleveland Cavaliers</a></b><br /><a href='http://www.sportmapworld.com/venue/quicken-loans-arena/'>Quicken Loans Arena</a>"
});	
makeMarker({
  position: generateLatLng(32.790420054007754,-96.81029230356216),
  title: "Dallas Mavericks",
  sidebardbItem: "Dallas Mavericks",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/dallas-mavericks/'>Dallas Mavericks</a></b><br /><a href='http://www.sportmapworld.com/venue/american-airlines-center/'>American Airlines Center</a>"
});	
makeMarker({
  position: generateLatLng(39.74856961976832,-105.00763803720474),
  title: "Denver Nuggets",
  sidebardbItem: "Denver Nuggets",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/denver-nuggets/'>Denver Nuggets</a></b><br /><a href='http://www.sportmapworld.com/venue/pepsi-center/'>Pepsi Center</a>"
});	
makeMarker({
  position: generateLatLng(42.696944,-83.245556),
  title: "Detroit Pistons",
  sidebardbItem: "Detroit Pistons",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/detroit-pistons/'>Detroit Pistons</a></b><br /><a href='http://www.sportmapworld.com/venue/the-palace-of-auburn-hills/'>The Palace of Auburn Hills</a>"
});	
makeMarker({
  position: generateLatLng(37.750267,-122.202853),
  title: "Golden State Warriors",
  sidebardbItem: "Golden State Warriors",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/golden-state-warriors/'>Golden State Warriors</a></b><br /><a href='http://www.sportmapworld.com/venue/oracle-arena/'>Oracle Arena</a>"
});	
makeMarker({
  position: generateLatLng(29.750833,-95.362222),
  title: "Houston Rockets",
  sidebardbItem: "Houston Rockets",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/houston-rockets/'>Houston Rockets</a></b><br /><a href='http://www.sportmapworld.com/venue/toyota-center/'>Toyota Center</a>"
});	
makeMarker({
  position: generateLatLng(39.763889,-86.155556),
  title: "Indiana Pacers",
  sidebardbItem: "Indiana Pacers",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/indiana-pacers/'>Indiana Pacers</a></b><br /><a href='http://www.sportmapworld.com/venue/bankers-life-fieldhouse/'>Bankers Life Fieldhouse</a>"
});	
makeMarker({
  position: generateLatLng(34.04303865743706,-118.26711416244507),
  title: "Los Angeles Clippers",
  sidebardbItem: "Los Angeles Clippers",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/los-angeles-clippers/'>Los Angeles Clippers</a></b><br /><a href='http://www.sportmapworld.com/venue/staples-center/'>Staples Center</a>"
});	
makeMarker({
  position: generateLatLng(34.04303865743706,-118.26711416244507),
  title: "Los Angeles Lakers",
  sidebardbItem: "Los Angeles Lakers",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/los-angeles-lakers/'>Los Angeles Lakers</a></b><br /><a href='http://www.sportmapworld.com/venue/staples-center/'>Staples Center</a>"
});	
makeMarker({
  position: generateLatLng(35.138333,-90.050556),
  title: "Memphis Grizzlies",
  sidebardbItem: "Memphis Grizzlies",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/memphis-grizzlies/'>Memphis Grizzlies</a></b><br /><a href='http://www.sportmapworld.com/venue/fedex-forum/'>FedExForum</a>"
});	
makeMarker({
  position: generateLatLng(25.781389,-80.187778),
  title: "Miami Heat",
  sidebardbItem: "Miami Heat",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/miami-heat/'>Miami Heat</a></b><br /><a href='http://www.sportmapworld.com/venue/americanairlines-arena/'>American Airlines Arena</a>"
});	
makeMarker({
  position: generateLatLng(43.043619,-87.916833),
  title: "Milwaukee Bucks",
  sidebardbItem: "Milwaukee Bucks",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/milwaukee-bucks/'>Milwaukee Bucks</a></b><br /><a href='http://www.sportmapworld.com/venue/bmo-harris-bradley-center/'>BMO Harris Bradley Center</a>"
});	
makeMarker({
  position: generateLatLng(44.979444,-93.276111),
  title: "Minnesota Timberwolves",
  sidebardbItem: "Minnesota Timberwolves",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/minnesota-timberwolves/'>Minnesota Timberwolves</a></b><br /><a href='http://www.sportmapworld.com/venue/target-center/'>Target Center</a>"
});	
makeMarker({
  position: generateLatLng(29.94895,-90.082178),
  title: "New Orleans Pelicans",
  sidebardbItem: "New Orleans Pelicans",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/new-orleans-hornets/'>New Orleans Pelicans</a></b><br /><a href='http://www.sportmapworld.com/venue/smoothie-king-center/'>Smoothie King Center</a>"
});	
makeMarker({
  position: generateLatLng(40.750481718523844,-73.9935502409935),
  title: "New York Knicks",
  sidebardbItem: "New York Knicks",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/new-york-knicks/'>New York Knicks</a></b><br /><a href='http://www.sportmapworld.com/venue/madison-square-garden/'>Madison Square Garden</a>"
});	
makeMarker({
  position: generateLatLng(35.463333,-97.515),
  title: "Oklahoma City Thunder",
  sidebardbItem: "Oklahoma City Thunder",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/oklahoma-city-thunder/'>Oklahoma City Thunder</a></b><br /><a href='http://www.sportmapworld.com/venue/chesapeake-energy-arena/'>Chesapeake Energy Arena</a>"
});	
makeMarker({
  position: generateLatLng(28.539167,-81.383611),
  title: "Orlando Magic",
  sidebardbItem: "Orlando Magic",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/orlando-magic/'>Orlando Magic</a></b><br /><a href='http://www.sportmapworld.com/venue/amway-center/'>Amway Center</a>"
});	
makeMarker({
  position: generateLatLng(39.90112133861436,-75.17172664403915),
  title: "Philadelphia 76ers",
  sidebardbItem: "Philadelphia 76ers",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/philadelphia-76ers/'>Philadelphia 76ers</a></b><br /><a href='http://www.sportmapworld.com/venue/wells-fargo-center/'>Wells Fargo Center</a>"
});	
makeMarker({
  position: generateLatLng(33.445747,-112.071269),
  title: "Phoenix Suns",
  sidebardbItem: "Phoenix Suns",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/phoenix-suns/'>Phoenix Suns</a></b><br /><a href='http://www.sportmapworld.com/venue/us-airways-center/'>US Airways Center</a>"
});	
makeMarker({
  position: generateLatLng(45.531389,-122.666944),
  title: "Portland Trail Blazers",
  sidebardbItem: "Portland Trail Blazers",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/portland-trail-blazers/'>Portland Trail Blazers</a></b><br /><a href='http://www.sportmapworld.com/venue/moda-center/'>Moda Center</a>"
});	
makeMarker({
  position: generateLatLng(38.649072175048325,-121.51800513267517),
  title: "Sacramento Kings",
  sidebardbItem: "Sacramento Kings",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/sacramento-kings/'>Sacramento Kings</a></b><br /><a href='http://www.sportmapworld.com/venue/sleep-train-arena/'>Sleep Train Arena</a>"
});	
makeMarker({
  position: generateLatLng(29.426944,-98.4375),
  title: "San Antonio Spurs",
  sidebardbItem: "San Antonio Spurs",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/san-antonio-spurs/'>San Antonio Spurs</a></b><br /><a href='http://www.sportmapworld.com/venue/att-center/'>AT&amp;T Center</a>"
});	
makeMarker({
  position: generateLatLng(43.64329216093772,-79.37907457351684),
  title: "Toronto Raptors",
  sidebardbItem: "Toronto Raptors",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/toronto-raptors/'>Toronto Raptors</a></b><br /><a href='http://www.sportmapworld.com/venue/air-canada-centre/'>Air Canada Centre</a>"
});	
makeMarker({
  position: generateLatLng(40.768306,-111.901203),
  title: "Utah Jazz",
  sidebardbItem: "Utah Jazz",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/utah-jazz/'>Utah Jazz</a></b><br /><a href='http://www.sportmapworld.com/venue/energysolutions-arena/'>EnergySolutions Arena</a>"
});	
makeMarker({
  position: generateLatLng(38.898007404102145,-77.02102392911911),
  title: "Washington Wizards",
  sidebardbItem: "Washington Wizards",
  content: "<b><a href='http://www.sportmapworld.com/team/basketball/north-america/washington-wizards/'>Washington Wizards</a></b><br /><a href='http://www.sportmapworld.com/venue/verizon-center/'>Verizon Center</a>"
});	

console.log(data.stadiums);

fs.writeFileSync('./input/stadiums.json', JSON.stringify(data, null, 4));