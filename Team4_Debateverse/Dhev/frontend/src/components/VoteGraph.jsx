import { BarChart } from 'lucide-react';

const VoteGraph = ({ options }) => {
  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);
  const maxVotes = Math.max(...options.map(opt => opt.votes), 1);
  
  const colors = [
    'from-orange-400 to-orange-500',
    'from-yellow-400 to-yellow-500',
    'from-green-400 to-green-500',
    'from-blue-400 to-blue-500',
    'from-purple-400 to-purple-500',
    'from-pink-400 to-pink-500',
    'from-red-400 to-red-500',
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-4">
      <div className="flex items-center mb-4">
        <BarChart className="text-gray-500 mr-2" size={20} />
        <h3 className="text-lg font-semibold text-gray-700">Vote Distribution</h3>
      </div>
      
      <div className="flex items-end space-x-4 h-48">
        {options.map((option, index) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          
          return (
            <div
              key={option.id}
              className="flex flex-col items-center flex-1"
            >
              <div className="text-sm font-medium text-gray-600 mb-2">
                {option.votes} votes
              </div>
              <div className="w-full relative group">
                <div
                  className={`w-full bg-gradient-to-t ${colors[index % colors.length]} 
                    rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 
                    cursor-pointer relative overflow-hidden`}
                  style={{
                    height: `${(option.votes / maxVotes) * 100}%`,
                    minHeight: '24px'
                  }}
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  {percentage.toFixed(1)}%
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600 text-center">
                <div className="font-medium">Option {index + 1}</div>
                <div className="text-xs text-gray-500 mt-1 max-w-[120px] truncate" title={option.text}>
                  {option.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
    
    </div>
  );
};

export default VoteGraph;