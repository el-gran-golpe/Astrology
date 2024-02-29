import React from 'react';

const CastSection = () => {
    const castMembers = [
        { name: "Cillian Murphy", character: "J. Robert Oppenheimer" },
        { name: "Emily Blunt", character: "Katherine Oppenheimer" },
        { name: "Matt Damon", character: "Leslie Groves Jr." },
        // Add more cast members as needed
    ];

    return (
        <div className="mt-10">
            <h2 className="text-2xl text-gray-300 mb-4">Cast</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {castMembers.map((member, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        {/* Placeholder for actor's photo if you have one */}
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0"></div>
                        <div>
                            <p className="text-lg text-white">{member.name}</p>
                            <p className="text-sm text-gray-400">{member.character}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CastSection;
