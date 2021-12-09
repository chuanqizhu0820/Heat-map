fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
.then(response => response.json())
.then(data => {
    console.log(data);
    const baseTemp = data.baseTemperature;
    const subTitle = document.querySelector("#sub-title");
    subTitle.textContent = `1753 - 2015: base temperature ${baseTemp}℃`;

    let objArr = Object.values(data)[1];
    let varianceArr = [];
    for(const item of objArr){
        varianceArr.push(Object.values(item)[2])
    }
    const maxTemp = Math.max(...varianceArr)+baseTemp;
    const minTemp = Math.min(...varianceArr)+baseTemp;
    const rangeTemp = maxTemp - minTemp;

    const width = 1050;
    const height = 480;
    const paddingLeft = 50;
    const paddingBottom = 50;
    const cellWidth = 4;
    const cellHeight = 40;
    const svg = d3.select('svg')
                .attr('width', `${width+paddingLeft}`)
                .attr('height', `${height+paddingBottom}`);

    const tooltip = d3.select('body')
                      .append('div')
                      .attr("id", "tooltip")
                      .style('opacity','0')

    const colorArr = ['#CC0000', '#CC8000', '#CCCC00','#80CC00','#00CC80','#00CCCC','#0080CC','#0000CC'];

    const monthList = ['January', 'February', 'March','April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function getMonth(num){
        return monthList[num];
    }
                      
    svg
      .append('g')
      .selectAll('rect')
      .data(data.monthlyVariance)
      .enter()
      .append('rect')
        .attr('class','cell')
        .attr('data-month', (d)=>`${d.month-1}`)
        .attr('data-year', (d)=>`${d.year}`)
        .attr('data-temp', (d)=>`${d.variance+baseTemp}`)
        .attr('width', `${cellWidth}`)
        .attr('height', `${cellHeight}`)
        .attr('x',(d,i)=>`${Math.floor(i/12)*4+paddingLeft}`)
        .attr('y',(d,i)=>`${(i%12)*40}`)
        .attr('fill', (d)=>
            {
                const currTemp = d.variance + baseTemp;
                if ((currTemp-minTemp)/rangeTemp<0.125){
                    return colorArr[0]
                }else if ((currTemp-minTemp)/rangeTemp<=0.25){
                    return colorArr[1]
                }else if ((currTemp-minTemp)/rangeTemp<=0.375){
                    return colorArr[2]
                }else if ((currTemp-minTemp)/rangeTemp<=0.500){
                    return colorArr[3]
                }else if ((currTemp-minTemp)/rangeTemp<=0.625){
                    return colorArr[4]
                }else if ((currTemp-minTemp)/rangeTemp<=0.750){
                    return colorArr[5]
                }else if ((currTemp-minTemp)/rangeTemp<=0.875){
                    return colorArr[6]
                }else if ((currTemp-minTemp)/rangeTemp<=1.00){
                    return colorArr[7]
                }
            })
       .on('mouseover', function(e,d){
           d3.select(this).style("stroke", "black");
           tooltip.attr('data-year', `${d.year}`).style('opacity','1')

       })
       .on('mousemove', function(e,d){
           const xp = e.pageX;
           const yp = e.pageY;
           tooltip.html(`<p>${d.year}-${getMonth(d.month-1)}</p><p>${(d.variance+baseTemp).toFixed(2)}</p><p>${d.variance}°C</p>`)
                  .style('position', 'absolute')
                  .style("left",`${xp+10}px`)
                  .style("top", `${yp-50}px`)
                  .style('background-color', 'white')
                  .style('padding', '5px')
                  .style('border-radius', '5px')
       })
       .on('mouseout', function(e,d){
           d3.select(this).style("stroke", "none");
           tooltip.style('opacity','0');
       })
        
    const xScale = d3.scaleLinear()
                     .domain([1753,2015])
                     .range([0,width]);

    let tickArr = []
    for(let i=xScale.domain()[0];i<=xScale.domain()[1];i++){
        if (i%10===0){
            tickArr.push(i)
        }
    };

    const yScale = d3.scaleBand()
                     .domain(monthList)
                     .range([0,height]);

    const xAxis = d3.axisBottom(xScale).tickValues(tickArr).tickFormat(function (year) {
      return `${year}`;
    });

    const yAxis = d3.axisLeft(yScale);

    svg
    .append('g')
    .attr('id', 'x-axis')
    .attr("transform", `translate(`+`${paddingLeft}`+`,`+`${height}`+`)`)
    .call(xAxis)

    svg
    .append('g')
    .attr('id', 'y-axis')
    .attr("transform", `translate(`+`${paddingLeft}`+`,`+`0)`)
    .call(yAxis);

    const legendScale = d3.scaleLinear().domain([minTemp,maxTemp]).range([0,400]);
    const legendAxis = d3.axisBottom(legendScale);
    console.log(legendScale.domain());

    d3.select('#legend')
      .attr('width', '400px')
      .append('g')
      .selectAll('rect')
      .data(colorArr)
      .enter()
      .append('rect')
      .attr('width','50px')
      .attr('height','10px')
      .attr('x', (d,i)=>`${i*50}`)
      .attr('fill',(d)=>`${d}`);
      
    d3.select('#legend')
      .append('g')
      .attr("transform", "translate(0,10)")
      .call(legendAxis) 
} );

