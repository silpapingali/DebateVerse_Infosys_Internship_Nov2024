import { Component, Input, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-vote-chart',
  templateUrl: './vote-chart.component.html',
  styleUrls: ['./vote-chart.component.css']
})
export class VoteChartComponent implements OnInit {
  @Input() votes: number[] = [];  // To store the vote counts of options
  @Input() options: string[] = [];  // To store the option titles

  chart: any; // Chart.js chart instance

  ngOnInit() {
    // Creating the chart when the component initializes
    this.createChart();
  }

  ngOnChanges() {
    // Recreate chart if the input changes (like vote counts or options)
    this.createChart();
  }

  createChart() {
    // Destroy existing chart if any
    if (this.chart) {
      this.chart.destroy();
    }

    // Create a new chart
    this.chart = new Chart('voteChartCanvas', {
      type: 'bar', // You can change this to 'pie', 'line', etc.
      data: {
        labels: this.options, // Labels from the options array
        datasets: [{
          label: 'Vote Counts',
          data: this.votes, // Vote data for each option
          backgroundColor: 'rgba(54, 162, 235, 0.2)', // Bar color
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
