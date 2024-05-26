import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { getTranslationFunction } from '../../utils/localization.ts';

const Row = ({ row, index, expandedRow, toggleRow }) => {
    const isExpanded = expandedRow === index;
    const toggle = () => toggleRow(index);

    return (
        <>
            <tr key={index} className="text-sm text-gray-200 items-center border-b border-gray-500">
                <td className="text-center py-2">
                    <FontAwesomeIcon
                        icon={faCaretDown}
                        onClick={toggle}
                        aria-expanded={isExpanded}
                        aria-controls={`details-${index}`}
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
                </td>
                <td className="px-4 text-left">{row.platform}</td>
                <td className="px-4 text-left">{row.platform_monetization}</td>
                <td className="px-4 text-left text-blue-300 cursor-pointer hover:text-blue-500">
                    <a href={row.url} target="_blank" rel="noopener noreferrer">Watch here</a>
                </td>
            </tr>
            {isExpanded && (
                <tr id={`details-${index}`} className="bg-gray-700 rounded-lg shadow">
                    <td colSpan="4" className="px-4 py-2">
                        <p className="text-gray-300">{row.platform}</p>
                        <p className="text-gray-300">{row.platform_monetization}</p>
                        <p className="text-gray-300">
                            <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-500">Watch here</a>
                        </p>
                    </td>
                </tr>
            )}
        </>
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
        <section className="bg-gray-900 mt-10 rounded-xl shadow-xl" aria-labelledby="where-to-watch-heading">
            <h2 id="where-to-watch-heading" className="text-gray-300 text-2xl mb-4 font-bold">{t("Where to watch")}</h2>
            <div className="bg-gray-800 p-4 rounded-lg overflow-hidden shadow-lg">
                <table className="min-w-full divide-y divide-gray-600">
                    <thead>
                        <tr className="text-base font-semibold text-gray-200 py-3 border-b border-gray-600">
                            <th className="text-center py-3">
                                <FontAwesomeIcon
                                    icon={faCaretDown}
                                    onClick={toggleRowsVisibility}
                                    aria-expanded={rowsVisible}
                                    aria-controls="rows-content"
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
                            </th>
                            <th className="px-4 text-left">{t("Platform")}</th>
                            <th className="px-4 text-left">{t("Availability")}</th>
                            <th className="px-4 text-left">{t("Link")}</th>
                        </tr>
                    </thead>
                    <tbody id="rows-content">
                        {rowsVisible && (
                            rows.length > 0 ? (
                                rows.map((row, index) => (
                                    <Row key={index} row={row} index={index} expandedRow={expandedRow} toggleRow={toggleRow} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center text-gray-200 py-4">{t("No links available at this moment")}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
