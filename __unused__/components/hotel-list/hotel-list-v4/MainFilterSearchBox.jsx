  import { useState } from "react";
  import LocationSearch from "./LocationSearch";

  const MainFilterSearchBox = ({ onSearch }) => {
    const [searchData, setSearchData] = useState({ city: null, category: "" });

    const handleSearch = () => {
      // const { city, category } = searchData;
      // if (!city || !category) {
      //   alert("Please select both a city and category.");
      //   return;
      // }

      // Send selected filters to parent
      onSearch(searchData);
    };

    return (
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '12px',
        marginTop: '30px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        zIndex: 30,
        width: '100%',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '16px',
          alignItems: 'center'
        }}>
          {/* Location & Category Search */}
          <div style={{ position: 'relative', width: '100%' }}>
            <LocationSearch
  onChange={(val) => {
    setSearchData(val);
    onSearch(val); // auto-search
  }}
/>

          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#13357B',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100%',
              minHeight: '56px',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
            }}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: '10px' }}
            >
              <path 
                d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M19 19L14.65 14.65" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            Search
          </button>
        </div>
      </div>
    );
  };

  export default MainFilterSearchBox;
