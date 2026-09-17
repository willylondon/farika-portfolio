'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { approveBooking, rejectBooking } from '@/actions/admin';
import { FileImage, Check, X, Loader2 } from 'lucide-react';

interface BookingActionsProps {
  bookingId: string;
  status: string;
  receiptPath: string | null;
}

export default function BookingActions({ bookingId, status, receiptPath }: BookingActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      await approveBooking(bookingId);
      router.refresh();
    } catch (error) {
      console.error('Error approving booking:', error);
      alert('Failed to approve booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this receipt? The booking will revert to Pending Payment.')) {
      return;
    }
    
    try {
      setIsLoading(true);
      await rejectBooking(bookingId);
      router.refresh();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert('Failed to reject booking');
    } finally {
      setIsLoading(false);
    }
  };

  if (status !== 'RECEIPT_UPLOADED') {
    return (
      <div className="text-slate-400 text-xs italic">
        No actions available
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-end space-x-2">
        {receiptPath && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center p-1.5 border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-50"
            title="View Receipt"
          >
            <FileImage className="w-4 h-4" />
          </button>
        )}
        
        <button
          onClick={handleApprove}
          disabled={isLoading}
          className="inline-flex items-center p-1.5 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
          title="Approve"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        </button>

        <button
          onClick={handleReject}
          disabled={isLoading}
          className="inline-flex items-center p-1.5 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
          title="Reject"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        </button>
      </div>

      {showModal && receiptPath && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Payment Receipt</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1 flex justify-center items-center bg-slate-100">
              <img 
                src={receiptPath.startsWith('http') ? receiptPath : `/api/receipts/${receiptPath.split('/').pop()}`} 
                alt="Payment Receipt" 
                className="max-w-full h-auto object-contain"
              />
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end space-x-3">
              <button
                onClick={handleReject}
                disabled={isLoading}
                className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  handleApprove();
                  setShowModal(false);
                }}
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Approve Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
