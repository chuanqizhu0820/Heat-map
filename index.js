fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
.then(response => response.json())
.then(data => {
    console.log(data);
    const subTitle = document.querySelector("#sub-title");
    subTitle.textContent = `1753 - 2015: base temperature ${data.baseTemperature}℃`;
    const svg = d3.select('svg')
                  .attr('width', 500)
                  .attr('height', 2000)
                  .append('g');

    svg
      .selectAll('rect')
      .data(data.monthlyVariance)
      .enter()
      .append('rect')
      .attr('width', '4')
      .attr('height', '40')
      .attr('x',(d,i)=>Math.floor(i/12)*4)
      .attr('y',(d,i)=>(i%12)*40)
      .attr('fill', 'rgb(128,0,128)');

    const xScale = d3.scaleLinear()
                     .domain([1700,2050])
                     .range([0,500]);

    const yScale = d3.scaleBand()
                     .domain(['Jan', 'Feb', 'Mar','Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
                     .range([0,500])
    

} );