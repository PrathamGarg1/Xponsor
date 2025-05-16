// components/ui/Pagination.js
'use client';
export default function Pagination({ page, hasMore, onPrevious, onNext }) {
    return (
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={onPrevious}
          disabled={page <= 1}
          className={`px-4 py-2 rounded ${
            page <= 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">Page {page}</span>
        <button
          onClick={onNext}
          disabled={!hasMore}
          className={`px-4 py-2 rounded ${
            !hasMore ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Next
        </button>
      </div>
    );
  }
  