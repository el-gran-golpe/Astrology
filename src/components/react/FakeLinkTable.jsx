import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const Row = ({ row, index, expandedRow, toggleRow }) => {
    const isExpanded = expandedRow === index;
    const isLastRow = index < 4; // Adjusted for zero-based index, assuming 5 rows total
    const toggle = () => toggleRow(index);

    return (
        <div key={index} className={`grid grid-cols-6 text-center text-sm text-gray-200 py-2 items-center ${isLastRow ? 'border-b border-gray-500' : ''}`}>
            <div className="place-self-center">
                <FontAwesomeIcon
                    icon={faCaretDown}
                    onClick={toggle}
                    className={`cursor-pointer hover:text-gray-300 transition ease-in-out duration-150 ${isExpanded ? 'transform rotate-180' : ''}`}
                    style={{
                        borderRadius: '50%',
                        border: '1px solid #64748B', // Soften the border color
                        padding: '2px',
                        width: '16px', // Subtly smaller, for less emphasis
                        height: '16px',
                        backgroundColor: '#374151', // Darker for contrast with main button
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                    }}
                />
            </div>
            <div className="col-span-5 flex justify-between items-center px-4">
                <span>{row.option}</span>
                <span>{row.servidor}</span>
                <span className="bg-red-500 rounded-full text-white px-2 py-0.5 text-xs">LAT</span> {/* Adjusted for consistency */}
                <span>{row.formato}</span>
                <span className="text-blue-300 cursor-pointer hover:text-blue-500">Descargar</span>
            </div>
            {isExpanded && (
                <div className="col-span-6 mt-2 mb-4 px-4 py-2 bg-gray-700 rounded-lg shadow">
                    <p className="text-gray-300">Detalles adicionales sobre la Opción {row.option}</p>
                </div>
            )}
        </div>
    );
};

const FakeLinkTable = () => {
    const [expandedRow, setExpandedRow] = useState(null);
    const [rowsVisible, setRowsVisible] = useState(false);
    const rows = Array(5).fill({ option: 'Enlace', servidor: 'Varios', audio: 'Latino', formato: 'HD 1080p' });

    const toggleRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    const toggleRowsVisibility = () => {
        setRowsVisible(!rowsVisible);
    };

    return (
        <div className="bg-gray-900 p-6 mt-8 rounded-xl shadow-xl"> {/* Careful there is two background colors here */}
            <h2 className="text-gray-100 text-3xl mb-4 font-bold">Where to watch</h2>
            <div className="bg-gray-800 p-4 rounded-lg overflow-hidden shadow-lg">
                <div className="grid grid-cols-6 text-center text-base font-semibold text-gray-200 py-3 border-b border-gray-600">
                    <div className="place-self-center">
                        <FontAwesomeIcon
                            icon={faCaretDown}
                            onClick={toggleRowsVisibility}
                            className={`cursor-pointer text-gray-200 hover:text-green-400 transform transition-transform ease-in-out duration-300 ${rowsVisible ? 'rotate-180' : ''}`}
                            style={{
                                borderRadius: '100%',
                                border: '2px solid #10B981', // Highlight color for main button
                                padding: '4px',
                                width: '24px',
                                height: '24px',
                                backgroundColor: '#111827', // Contrast with the row buttons
                                boxShadow: '0 2px 4px rgba(31, 41, 55,1)',
                            }}
                        />
                    </div>
                    <div className="col-span-5 flex justify-between items-center px-4">
                        <span>Enlace</span>
                        <span>Servidor</span>
                        <span>Audio</span>
                        <span>Formato</span>
                        <span>Enlaces</span>
                    </div>
                </div>
                {rowsVisible && rows.map((row, index) => <Row key={index} row={row} index={index} expandedRow={expandedRow} toggleRow={toggleRow} />)}
            </div>
        </div>
    );
};

export default FakeLinkTable;
