window.onload = function () {

  let corrects = [];
  document.querySelectorAll('.category .quantity.good').forEach(tag => corrects.push(+tag.innerHTML));
  const totalCorrects = corrects.reduce((act, acc) => act + acc);

  document.querySelector('.questions .quantity.good').innerHTML = totalCorrects;

  let incorrects = [];
  document.querySelectorAll('.category .quantity.bad').forEach(tag => incorrects.push(+tag.innerHTML));
  const totalIncorrects = incorrects.reduce((act, acc) => act + acc);

  document.querySelector('.questions .quantity.bad').innerHTML = totalIncorrects;

  document.querySelector('.questions .quantity.total').innerHTML = totalIncorrects + totalCorrects;


  console.log('loaded');

  console.log(data);
  delete data.ironhack;

  let answers = [];
  for (let key in data) {
    console.log(key)
    const failed = (data[key].failed) ? data[key].failed : 1;
    answers.push(data[key].correct / failed)
  }

  var width = document.getElementById('graph').offsetWidth,
    height = document.getElementById('graph').offsetHeight,
    padding = 1.5, // separation between same-color nodes
    clusterPadding = 6, // separation between different-color nodes
    // maxRadius = Math.min(height, width)/9;
    maxRadius = 50
  // minRadius = Math.min(height, width)/12;
  minRadius = 5

  console.log(answers)
  console.log(d3.min(answers))

  const values = [5, 20, 10, 45, 65, 69, 10]// ;number of distinct clusters

  var stadisticValues = d3.scale.linear().domain([d3.min(answers), d3.max(answers)]).range([minRadius, maxRadius]);
  var colors = ['#F0D909', '#F44336', '#4CAF50', '#673AB7', '#03A9F4', '#FF9800'];
  //var teSalesMinerales = d3.scale.linear().domain([d3.min(answers), d3.max(answers)]).range(["green", "blue"]);

  var n = answers.length, // total number of nodes
    m = 1;


  var color = d3.scale.category10()
    .domain(d3.range(m));

  // The largest node for each cluster.
  var clusters = new Array(m);

  var nodes = d3.range(n).map(function (element, index) {
    var i = Math.floor(Math.random() * m),
      r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
      d = { cluster: i, radius: stadisticValues(answers[index]) };
    if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
    return d;
  });

  // Use the pack layout to initialize node positions.
  d3.layout.pack()
    .sort(null)
    .size([width, height])
    .children(function (d) { return d.values; })
    .value(function (d) { return d.radius * d.radius; })
    .nodes({
      values: d3.nest()
        .key(function (d) { return d.cluster; })
        .entries(nodes)
    });

  var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(.02)
    .charge(0)
    .on("tick", tick)
    .start();

  var svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);

  var node = svg.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .style("fill", function (d, i) { return colors[i] })
    .call(force.drag);

  console.log(nodes, colors)

  node.transition()
    .duration(750)
    .delay(function (d, i) { return i * 5; })
    .attrTween("r", function (d) {
      var i = d3.interpolate(0, d.radius);
      return function (t) { return d.radius = i(t); };
    });

  function tick(e) {
    node
      .each(cluster(10 * e.alpha * e.alpha))
      .each(collide(.5))
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; });
  }

  // Move d to be adjacent to the cluster node.
  function cluster(alpha) {
    return function (d) {
      var cluster = clusters[d.cluster];
      if (cluster === d) return;
      var x = d.x - cluster.x,
        y = d.y - cluster.y,
        l = Math.sqrt(x * x + y * y),
        r = d.radius + cluster.radius;
      if (l != r) {
        l = (l - r) / l * alpha;
        d.x -= x *= l;
        d.y -= y *= l;
        cluster.x += x;
        cluster.y += y;
      }
    };
  }

  // Resolves collisions between d and all other circles.
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function (d) {
      var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
      quadtree.visit(function (quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }


};