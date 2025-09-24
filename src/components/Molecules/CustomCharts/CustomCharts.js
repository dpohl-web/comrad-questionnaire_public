import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { Radar, Doughnut, Bar, PolarArea } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
	RadarController,
	LineElement,
	PointElement,
	RadialLinearScale,
	DoughnutController,
	ArcElement,
	BarController,
	BarElement,
	CategoryScale,
	LinearScale,
	PolarAreaController,
} from 'chart.js';
import './CustomCharts.css';
import * as helperFunctions from '../../../helpers/helperFunctions';

Chart.register(
	RadarController,
	LineElement,
	PointElement,
	RadialLinearScale,
	DoughnutController,
	ArcElement,
	BarController,
	BarElement,
	CategoryScale,
	LinearScale,
	PolarAreaController,
    ChartDataLabels
);

export default class CustomCharts extends Component {
	chartPdf;

	getOrCreateLegendList = (chart, id) => {
		const legendContainer = document.getElementById(id);
		// console.log({ legendContainer });

		let listContainer = legendContainer.querySelector('ul');

		if (!listContainer) {
			listContainer = document.createElement('ul');
			listContainer.style.display = 'flex';
			listContainer.style.flexDirection = 'column';
			listContainer.style.margin = '0';
			listContainer.style.padding = '0';

			legendContainer.appendChild(listContainer);
		}

		return listContainer;
	};

	htmlLegendPlugin = {
		id: 'htmlLegend',
		afterUpdate: (chart, args, options) => {
			if (chart.canvas.id === 'customchart-pdf') {
				this.chartPdf = chart;
			}
			const ul = this.getOrCreateLegendList(chart, options.containerID);

			// Remove old legend items
			while (ul.firstChild) {
				ul.firstChild.remove();
			}

			// Reuse the built-in legendItems generator
			const items = chart.options.plugins.legend.labels.generateLabels(chart);

			items.forEach((item) => {
				const li = document.createElement('li');
				li.style.alignItems = 'center';
				li.style.cursor = 'pointer';
				li.style.display = 'flex';
				li.style.flexDirection = 'row';
				li.style.marginLeft = '10px';

				li.onclick = () => {
					// console.log('this', this);
					// console.log('chart click', chart);
					// console.log('chart click item blubbi', item);
                    // console.log('chart click item hidden', item.hidden);
					if (chart.canvas.id === 'customchart-view') {
						if (this.props.chartRefPdf) {
							// console.log('found chartRefPdf', this.props.chartRefPdf);
							this.updateChart(this.props.chartRefPdf.current.chartPdf, item);
						}
					}
					this.updateChart(chart, item);
				};

				// Color box
				const boxSpan = document.createElement('span');
				boxSpan.style.background = item.fillStyle;
				boxSpan.style.borderColor = item.strokeStyle;
				boxSpan.style.borderWidth = String(item.lineWidth) + 'px';
				boxSpan.style.display = 'inline-block';
				boxSpan.style.height = '20px';
				boxSpan.style.marginRight = '10px';
				boxSpan.style.width = '20px';

				// Text
				const textContainer = document.createElement('p');
				textContainer.style.color = item.fontColor;
				textContainer.style.margin = '0';
				textContainer.style.padding = '0';
				textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

				const text = document.createTextNode(item.text);
				textContainer.appendChild(text);

				li.appendChild(boxSpan);
				li.appendChild(textContainer);
				ul.appendChild(li);
			});
		},
	};

    createbaseImageFromChart() {
		const url = this.toBase64Image();
        const element = document.getElementById('chartBaseImage');
        if (element) { // If the user navigates to fast to another page, the element is not there. So we check here.
            element.src = url;

            const legendForPdfFile = document.getElementById('containerid-pdf');
            const legendDivToPupolate = document.getElementById('legend-to-populate');
            legendDivToPupolate.innerHTML = legendForPdfFile.innerHTML;
        }
	}

	updateChart = (chart, item) => {
		const { type } = chart.config;
		if (type === 'pie' || type === 'doughnut' || type === 'polarArea') {
			// Pie, polarArea and doughnut charts only have a single dataset and visibility is per item
			chart.toggleDataVisibility(item.index);
		} else {
			chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
		}
		chart.update();
	};

	generateChartData = (chartMode) => {
		const { questionnaireData, language } = this.props;
		const data = {
			labels: [],
			datasets: [],
		};
		let categoryindex = 0;
		let blockIndexInAllCategories = 0;

		questionnaireData.categories.forEach((oneCat) => {
			if (oneCat.evaluateCategory === '1') {
				let blockIndexInThisCategory = 0;
				const datasetsObject = {};
				const { catcolor } = oneCat;
				const newArray = new Array(blockIndexInAllCategories);

				datasetsObject.label = oneCat.categoryName[language];
				if (chartMode === 'radar') {
					datasetsObject.backgroundColor = catcolor.replace(',1)', ',.2)');
					datasetsObject.borderColor = catcolor;
				} else if (chartMode === 'bar') {
					datasetsObject.backgroundColor = catcolor.replace(',1)', ',.5)');
					datasetsObject.borderColor = catcolor;
				} else {
					datasetsObject.backgroundColor = [];
					datasetsObject.borderColor = '#fff';
				}

				datasetsObject.pointBackgroundColor = catcolor;
				datasetsObject.pointBorderColor = '#fff';
				datasetsObject.pointHoverBackgroundColor = '#fff';
				datasetsObject.pointHoverBorderColor = catcolor;
				datasetsObject.data = [];

				oneCat.categoryPages.forEach((onePage) => {
					if (onePage.pageEvaluate === '1') {
						onePage.blocks.forEach((oneBlock, y) => {
							data.labels[blockIndexInAllCategories] =
								!oneBlock.blockShortQuestion ||
								typeof oneBlock.blockShortQuestion[language] === 'undefined' ||
								oneBlock.blockShortQuestion[language] === ''
									? helperFunctions.formatLabel(oneBlock.blockQuestion[language], 40)
									: helperFunctions.formatLabel(oneBlock.blockShortQuestion[language], 40);

							// fill color for every label for the lagend
							if (chartMode === 'polar' || chartMode === 'doughnut') {
								if (categoryindex !== 0) {
									data.datasets[0].backgroundColor.push(catcolor.replace(',1)', ',.5)'));

									if (blockIndexInThisCategory === 0) {
										datasetsObject.backgroundColor = new Array(blockIndexInAllCategories).fill(0);
									}
								}

								datasetsObject.backgroundColor.push(catcolor.replace(',1)', ',.5)'));
							}

							if (categoryindex !== 0 && blockIndexInThisCategory === 0) {
								newArray.fill(0);
							}
							newArray.push(helperFunctions.getValues(onePage.savedFormValues, y));
							blockIndexInAllCategories += 1;
							blockIndexInThisCategory += 1;
						});
					}
				});
				datasetsObject.data = newArray;
				data.datasets.push(datasetsObject);
				categoryindex += 1;
			}
		});
		data.datasets.forEach((set) => {
			const appendAmount = blockIndexInAllCategories - set.data.length;

			set.data.push(...new Array(appendAmount).fill(0));
		});

		return data;
	};

	createChartOptions = (createPdfOptions, maxValueInAllCategories, diagramStyle, isComparePage = false) => {
		const options = {
			responsive: true,
			plugins: {
				htmlLegend: {
					// ID of the container to put the legend in
					containerID: this.props.containerId,
				},
				legend: {
					display: false,
				},
                datalabels: {
                    backgroundColor: function(context) {
                        return diagramStyle === 'radar' || diagramStyle === 'bar' ? context.dataset.borderColor : 'transparent';
                    },
                    color: 'white',
                    display: function(context) {
                      return context.dataset.data[context.dataIndex] > 0;
                    },
                    font: {
                      weight: 'bold'
                    },
                    formatter: Math.round
                }
			},
		};

		if (createPdfOptions) {
			options.animation = {
				onComplete: this.createbaseImageFromChart,
			};
		}

		if (diagramStyle === 'radar' || diagramStyle === 'polar' || diagramStyle === 'doughnut' || diagramStyle === 'bar') {
			options.maintainAspectRatio = false;
		}

		if (diagramStyle === 'radar') {
			options.scales = {
                r: {
                    suggestedMin: 0,
                    suggestedMax: maxValueInAllCategories,
                    ticks: {
                        callback: (label, index, labels) => {
                            if (Math.floor(label) === label) {
                                return label;
                            }
                            return '';
                        },
                    },
                }
			};
		}

		if (diagramStyle === 'polar') {
			options.scales = { 
                r: {
                    suggestedMin: 0,
                    suggestedMax: maxValueInAllCategories,
                    ticks: {
                        callback: (label, index, labels) => {
                            if (Math.floor(label) === label) {
                                return label;
                            }
                            return '';
                        },
                    },
                }
            }
		}

		if (diagramStyle === 'bar') {
			options.scales = {
				y: {
                    suggestedMin: 0,
                    suggestedMax: maxValueInAllCategories,
                    type: 'linear',
                    display: true,
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: (label, index, labels) => {
                            if (Math.floor(label) === label) {
                                return label;
                            }
                            return '';
                        },
                    },
                },
			};
		}
		return cloneDeep(options);
	}

	renderCharts = () => {
		const {
			isNotPdf,
			selectedOption,
			maxValueInAllCategories,
			createPdfOptions,
			chartId,
            containerId,
            generateChartDataForCompare,
            newData
		} = this.props;

		return isNotPdf ? (
			<div>
				{selectedOption === 'radar' && (
					<div className="result__chart-container">
						<Radar
							id={chartId}
							data={newData ? generateChartDataForCompare('radar', newData) : this.generateChartData('radar')}
							options={this.createChartOptions(createPdfOptions, maxValueInAllCategories, 'radar')}
							plugins={[this.htmlLegendPlugin]}
						/>
					</div>
				)}
				{selectedOption === 'doughnut' && (
					<div className="result__chart-container">
						<Doughnut
							id={chartId}
							data={this.generateChartData('doughnut')}
							options={this.createChartOptions(createPdfOptions, maxValueInAllCategories, 'doughnut')}
							plugins={[this.htmlLegendPlugin]}
						/>
					</div>
				)}
				{selectedOption === 'bar' && (
					<div className="result__chart-container">
						<Bar
							id={chartId}
							data={newData ? generateChartDataForCompare('bar', newData) : this.generateChartData('bar')}
							height={100}
							options={this.createChartOptions(createPdfOptions, maxValueInAllCategories, 'bar')}
							plugins={[this.htmlLegendPlugin]}
						/>
					</div>
				)}
				{selectedOption === 'polar' && (
					<div className="result__chart-container">
						<PolarArea
							id={chartId}
							data={this.generateChartData('polar')}
							options={this.createChartOptions(createPdfOptions, maxValueInAllCategories, 'polar')}
							plugins={[this.htmlLegendPlugin]}
						/>
					</div>
				)}
                <div id={containerId} className="html-legend-wrapper" />
			</div>
		) : (
			<div className="result__chart-wrapper">
                <div>
                    <img id="chartBaseImage" className="chartBaseImage" alt="chart" />
                    <div id="legend-to-populate" className="html-legend-wrapper" />
                </div>
			</div>
		);
	};

	render() {
		return <>{this.renderCharts()}</>;
	}
}

CustomCharts.propTypes = {
	language: PropTypes.string.isRequired,
	isNotPdf: PropTypes.bool.isRequired,
	catLength: PropTypes.number,
	questionnaireData: PropTypes.object.isRequired,
	selectedOption: PropTypes.string.isRequired,
	selectBoxOptions: PropTypes.array,
	catsWithoutTheGeneralInfos: PropTypes.array,
	maxValueInAllCategories: PropTypes.number.isRequired,
	createPdfOptions: PropTypes.bool.isRequired,
	chartId: PropTypes.string.isRequired,
	containerId: PropTypes.string.isRequired,
    chartRefPdf: PropTypes.object,
    generateChartDataForCompare: PropTypes.func,
    newData: PropTypes.object
};
