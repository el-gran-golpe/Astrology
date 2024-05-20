import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { getTranslationFunction } from '../../utils/localization.ts';

const Row = ({ row, index, expandedRow, toggleRow }) => {
    const isExpanded = expandedRow === index;
    const toggle = () => toggleRow(index);

    return (
        <div key={index} className={`grid grid-cols-6 text-center text-sm text-gray-200 py-2 items-center ${index < 4 ? 'border-b border-gray-500' : ''}`}>
            <div className="place-self-center">
                <FontAwesomeIcon
                    icon={faCaretDown}
                    onClick={toggle}
                    className={`cursor-pointer hover:text-gray-300 transition ease-in-out duration-150 ${isExpanded ? 'transform rotate-180' : ''}`}
                    style={{
                        borderRadius: '50%',
                        border: '1px solid #64748B',
                        padding: '2px',
                        width: '16px',
                        height: '16px',
                        backgroundColor: '#374151',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                    }}
                />
            </div>
            <div className="col-span-5 flex justify-between items-center px-4">
                <span>{row.platform}</span>
                <span>{row.platform_monetization}</span>
                <span className="text-blue-300 cursor-pointer hover:text-blue-500" onClick={() => window.open(row.url, "_blank")}>Watch here</span>
            </div>
            {isExpanded && (
                <div className="col-span-6 mt-2 mb-4 px-4 py-2 bg-gray-700 rounded-lg shadow">
                    <p className="text-gray-300">{row.platform}</p>
                    <p className="text-gray-300">{row.platform_monetization}</p>
                    <p className="text-gray-300"><a href={row.url} target="_blank" className="text-blue-300 hover:text-blue-500">Watch here</a></p>
                </div>
            )}
        </div>
    );
};

export default function FakeLinkTable({ lang, availableAt }) {
    const t = getTranslationFunction(lang);

    const [expandedRow, setExpandedRow] = useState(null);
    const [rowsVisible, setRowsVisible] = useState(false);
    const rows = availableAt.platforms || [];

    const toggleRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    const toggleRowsVisibility = () => {
        setRowsVisible(!rowsVisible);
    };

    return (
        <div className="bg-gray-900 mt-10 rounded-xl shadow-xl">
            <h2 className="text-gray-300 text-2xl mb-4 font-bold">{t("Where to watch")}</h2>
            <div className="bg-gray-800 p-4 rounded-lg overflow-hidden shadow-lg">
                <div className="grid grid-cols-6 text-center text-base font-semibold text-gray-200 py-3 border-b border-gray-600">
                    <div className="place-self-center">
                        <FontAwesomeIcon
                            icon={faCaretDown}
                            onClick={toggleRowsVisibility}
                            className={`cursor-pointer text-gray-200 hover:text-green-400 transform transition-transform ease-in-out duration-300 ${rowsVisible ? 'rotate-180' : ''}`}
                            style={{
                                borderRadius: '100%',
                                border: '2px solid #10B981',
                                padding: '4px',
                                width: '24px',
                                height: '24px',
                                backgroundColor: '#111827',
                                boxShadow: '0 2px 4px rgba(31, 41, 55,1)',
                            }}
                        />
                    </div>
                    <div className="col-span-5 flex justify-between items-center px-4">
                        <span>{t("Platform")}</span>
                        <span>{t("Availability")}</span>
                        <span>{t("Link")}</span>
                    </div>
                </div>
                {rowsVisible && (rows.length > 0 ? rows.map((row, index) => <Row key={index} row={row} index={index} expandedRow={expandedRow} toggleRow={toggleRow} />) : <div className="text-center text-gray-200 py-4">{t("No links available at this moment")}</div>)}
            </div>
        </div>
    );
}
