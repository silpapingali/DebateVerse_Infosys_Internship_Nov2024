import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service/auth-service.service';
import { DebateService } from '../../../services/debate-service/debate.service';

@Component({
  selector: 'app-all-debates',
  templateUrl: './all-debates.component.html',
  styleUrl: './all-debates.component.css',
})
export class AllDebatesComponent {
  searchQuery: string = '';
  likes: number = 0;
  votes: number = 0;
  postedAfter: any;
  exactMatch: boolean = false;

  allDebates: any[] = [];
  filteredDebates: any[] = []; // Separate array for filtered

  totalPages: number = 0;
  currentPage: number = 1;
  firstPage: boolean = true;
  lastPage: boolean = true;
  totalElements: number = 0;
  size: number = 10;
  noOfElements: number = 0;

  constructor(
    private _auth: AuthServiceService,
    private _router: Router,
    private _snack: MatSnackBar,
    private _debate: DebateService
  ) {
    // Redirect if not logged in
    this._auth.isLoggedIn$.subscribe((res) => {
      if (!res) {
        this._router.navigate(['/login']);
        this._snack.open('Please login to continue', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  ngOnInit() {
    this.fetchDebates();
  }

  fetchDebates(currentPage = 0, size = 5) {
    this._debate.getAllDebates(currentPage, size).subscribe({
      next: (res: any) => {
        console.log(res);
        this.totalPages = res.totalPages;
        this.currentPage = res.number + 1;
        this.firstPage = res.first;
        this.lastPage = res.last;
        this.totalElements = res.totalElements;
        this.size = res.size;
        this.noOfElements = res.numberOfElements;
        this.allDebates = res.content.map((debate: any) => {
          const totalVotes = debate.options.reduce(
            (sum: any, option: { totalVotes: any }) => sum + option.totalVotes,
            0
          );
          return {
            ...debate,
            totalVotes,
            chartOptions: this.generateChartOptions(debate.options, totalVotes),
          };
        });
        this.filteredDebates = [...this.allDebates]; // Initialize filteredDebates with allDebates
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onPageChange(event: any) {
    this.size = event.pageSize;
    this.currentPage = event.pageIndex; // MatPaginator starts at 0
    this.fetchDebates(this.currentPage, this.size); // Fetch debates for the new page
  }

  generateChartOptions(options: any[], totalVotes: number) {
    const yAxisMax = totalVotes > 0 ? Math.ceil(totalVotes / 5) * 5 : 10;
    return {
      animationEnabled: true,
      axisY: {
        title: 'Total Votes',
        includeZero: true,
        maximum: yAxisMax, // Set the maximum of Y-axis to the total votes of the debate
      },
      axisX: {
        labelFormatter: () => '', // Remove labels from the X-axis
      },
      data: [
        {
          type: 'column', // Use column chart type
          indexLabel: '{y}', // Shows y value on all Data Points
          indexLabelFontColor: '#5A5757',
          toolTipContent: '{label}: {y}', // Tooltip content with label and value
          dataPoints: options.map((option, index) => ({
            label: option.text, // Option text for tooltip
            y: option.totalVotes || 0, // Y-axis value is the number of votes for the option
          })),
        },
      ],
    };
  }

  onSearch() {
    const query = this.searchQuery?.toLowerCase().trim(); // Ensure query is lowercase and trimmed
    if (query) {
      this.filteredDebates = this.allDebates.filter(
        (debate) =>
          debate.text.toLowerCase().includes(query) ||
          debate.createdBy.name.toLowerCase().includes(query)
      );
    } else {
      this.filteredDebates = [...this.allDebates]; // Reset to all debates if search query is empty
    }
  }

  onFilterChange() {
    const minLikes = this.likes || 0; // Default to 0 if no value is set
    const minVotes = this.votes || 0; // Default to 0 if no value is set
    const postedAfterDate = this.postedAfter
      ? new Date(this.postedAfter)
      : null;

    console.log(minLikes, minVotes, postedAfterDate);

    this.filteredDebates = this.allDebates.filter((debate) => {
      const matchesLikes = debate.totalLikes >= minLikes;
      const matchesVotes = debate.totalVotes >= minVotes;
      const matchesPostedAfter = postedAfterDate
        ? new Date(debate.createdOn) > postedAfterDate
        : true;

      return matchesLikes && matchesVotes && matchesPostedAfter;
    });
  }
}
