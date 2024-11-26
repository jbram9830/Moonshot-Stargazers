import React from 'react'

function SearchSuggestions({ satellites, visible, searchQuery, onSelect }) {

    if(!visible || !searchQuery) {
        return null
    }

    const filteredSatellites = satellites.filter(satellite => 
        satellite.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    )

  return (
    <div className='absolute w-full top-10  max-h-[400px] bg-white rounded-lg overflow-y-auto z-50'>
        {filteredSatellites.length > 0 ? 
        (
            <ul className='py-2'>
                {filteredSatellites.map((satellite, index) => (
                    <li
                    key={satellite.satelliteID || satellite.id || index}
                    className='p-4 text-[12px] hover:bg-blue-50 cursor-pointer'
                    onClick={() => onSelect(satellite)}>
                        {satellite.name}
                    </li>
                ))}
            </ul>
        ): 
        (
            <div className='p-4 text-gray-500 z-50'>No Options</div>
        )}
    </div>
  )
}

export default SearchSuggestions