import { useState } from 'react';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

function SearchBar({ onSearch, placeholder = "Search friends..." }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative mb-4 w-full max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
      />
      {searchTerm && (
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => {
            setSearchTerm('');
            onSearch('');
          }}
        >
          <span className="text-gray-400 hover:text-gray-600">✕</span>
        </button>
      )}
    </div>
  );
}
SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBar;
