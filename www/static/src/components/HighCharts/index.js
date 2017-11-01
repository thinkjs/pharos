import React from 'react';
// import ReactHighCharts from 'react-highcharts';


let config = {
    chart: {
        type: 'column'
    },
    title: {
        text: ''
    },

    subtitle: {
        text: '按日期'
    },

    yAxis: {
        title: {
            text: ''
        },
    },
    xAxis: {
        title: {
            text: ''
        },
        categories: ['Apples', 'Bananas', 'Oranges'],
        labels: {
            overflow: 'justify'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },
    series: [{
        name: 'Installation',
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
    }, {
        name: 'Manufacturing',
        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
    }, {
        name: 'Sales & Distribution',
        data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
    }, {
        name: 'Project Development',
        data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
    }, {
        name: 'Other',
        data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

}

const HighCharts = ({ data = {},...props}) => {
    config.series = data.series;
    config.xAxis.categories = data.categories;
    return (
        <div></div>
        // <ReactHighCharts config={{...config,...props}}></ReactHighCharts>
    )
}

export default HighCharts


