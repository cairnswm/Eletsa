import React, { useState } from 'react';
import { Download } from 'lucide-react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UserTicket } from '../../types/ticket';

interface TicketPDFExportButtonProps {
  ticket: UserTicket;
  className?: string;
  disabled?: boolean;
}

export const TicketPDFExportButton: React.FC<TicketPDFExportButtonProps> = ({
  ticket,
  className = '',
  disabled = false,
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(amount);
  };

  const getStatusText = (used: number) => {
    return used === 0 ? "Valid" : "Used";
  };

  const downloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);

      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(ticket.ticket_code, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      // Create a temporary container for the PDF content
      const pdfContainer = document.createElement("div");
      pdfContainer.style.position = "absolute";
      pdfContainer.style.left = "-9999px";
      pdfContainer.style.top = "0";
      pdfContainer.style.width = "800px";
      pdfContainer.style.backgroundColor = "white";
      pdfContainer.style.padding = "40px";
      pdfContainer.style.fontFamily = "Arial, sans-serif";

      pdfContainer.innerHTML = `
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1E30FF, #FF2D95); padding: 20px; margin-bottom: 30px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; color: white;">
            <svg width="32" height="32" viewBox="0 0 100 100" style="margin-right: 12px;">
              <rect width="100" height="100" rx="20" fill="white"/>
              <text x="50" y="65" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="#1E30FF">E</text>
            </svg>
            <span style="font-size: 28px; font-weight: bold; color: white;">Eletsa</span>
          </div>
          <div style="color: white; font-size: 16px; font-weight: 500;">https://eletsa.cairns.co.za</div>
        </div>

        <!-- Ticket Content -->
        <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            <div style="flex: 1;">
              <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin: 0 0 16px 0;">${
                ticket.event_title
              }</h1>
              <div style="margin-bottom: 8px; display: flex; align-items: center; color: #6b7280;">
                <span style="margin-right: 8px;">📅</span>
                <span>${formatDate(ticket.start_datetime)}</span>
              </div>
              <div style="margin-bottom: 8px; display: flex; align-items: center; color: #6b7280;">
                <span style="margin-right: 8px;">🕐</span>
                <span>${formatTime(ticket.start_datetime)}</span>
              </div>
              <div style="margin-bottom: 8px; display: flex; align-items: center; color: #6b7280;">
                <span style="margin-right: 8px;">📍</span>
                <span>${ticket.location_name}</span>
              </div>
            </div>
            <div style="text-align: right; margin-left: 24px;">
              <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; margin-bottom: 8px; ${
                ticket.used === 0
                  ? "background-color: #dcfce7; color: #166534;"
                  : "background-color: #f3f4f6; color: #374151;"
              }">${getStatusText(ticket.used)}</span>
              <div style="font-size: 24px; font-weight: bold; color: #111827;">${formatCurrency(
                parseFloat(ticket.price)
              )}</div>
              <div style="font-size: 14px; color: #6b7280;">${
                ticket.quantity
              } ticket${ticket.quantity > 1 ? "s" : ""}</div>
            </div>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 14px; font-weight: 500; color: #111827;">${
                  ticket.ticket_type
                }</div>
                <div style="font-size: 12px; color: #6b7280;">Purchased: ${formatDate(
                  ticket.assigned_at
                )}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- QR Code Section -->
        ${
          ticket.used === 0
            ? `
        <div style="background: #f9fafb; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="text-align: center;">
            <div style="font-size: 14px; font-weight: 500; color: #111827; margin-bottom: 16px;">Entry Code</div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 16px;">
                <img src="${qrDataUrl}" alt="Ticket QR Code" style="width: 192px; height: 192px;" />
              </div>
              <div style="text-align: center;">
                <div style="font-size: 12px; color: #6b7280; font-family: monospace; margin-bottom: 4px;">${ticket.ticket_code}</div>
                <div style="font-size: 12px; color: #6b7280;">Show this code at the event entrance</div>
              </div>
            </div>
          </div>
        </div>
        `
            : ""
        }
      `;

      document.body.appendChild(pdfContainer);

      // Generate canvas from the container
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      // Remove the temporary container
      document.body.removeChild(pdfContainer);

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight
      );

      // Download the PDF
      const fileName = `ticket-${ticket.event_title
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}-${ticket.ticket_code.slice(0, 8)}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <button
      onClick={downloadPDF}
      disabled={disabled || isGeneratingPDF}
      className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <Download className="w-4 h-4" />
      <span className="text-sm font-medium hidden sm:inline">
        {isGeneratingPDF ? "Generating..." : "Download"}
      </span>
    </button>
  );
};