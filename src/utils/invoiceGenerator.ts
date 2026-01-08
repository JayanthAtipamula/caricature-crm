import { jsPDF } from "jspdf";
import logoImage from '../assets/bhanu_caricature_logo.png';

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  location: string;
  startTime: string;
  endTime: string;
  price: number;
  advancePayment: number;
  artists?: string[];
  contactNumber?: string;
}

// Use direct path from public folder
const logoUrl = '/@bhanu_caricature_logo.png';  // Note the leading slash

// Or if that doesn't work, try:
// const logoUrl = '/public/@bhanu_caricature_logo.png';

export const generateInvoice = async (data: InvoiceData) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.width;
  
  // Add logo
  const logoWidth = 25;
  const logoHeight = 25;
  const logoX = 20;
  const logoY = 20;

  // Add logo image using base64
  try {
    // Convert image to base64
    const response = await fetch(logoImage);
    const blob = await response.blob();
    const reader = new FileReader();
    
    await new Promise((resolve, reject) => {
      reader.onload = () => {
        try {
          const base64data = reader.result as string;
          doc.addImage(
            base64data,
            'PNG',
            logoX,
            logoY,
            logoWidth,
            logoHeight
          );
          resolve(null);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading logo:', error);
  }

  // Add blue line at top
  doc.setDrawColor(0, 102, 204);
  doc.setLineWidth(0.5);
  doc.line(20, 15, pageWidth - 20, 15);

  // Company name and title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(0, 102, 204);
  doc.text('Mr_Bhanu_Creates', logoX + logoWidth + 10, logoY + 10);
  
  doc.setFontSize(12);
  doc.setTextColor(128, 128, 128);
  doc.text('Live Caricature Artist', logoX + logoWidth + 10, logoY + 20);

  // Invoice title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE', 20, 70);

  // Invoice details box
  doc.setDrawColor(240, 240, 240);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(20, 80, pageWidth - 40, 25, 2, 2, 'F');
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Invoice Number: MRBHC-${data.invoiceNumber}`, 25, 90);
  doc.text(`Date: ${data.date}`, 25, 98);

  // To section
  doc.text('To:', 20, 120);
  doc.setFont("helvetica", "bold");
  doc.text(data.clientName, 20, 128);
  doc.setFont("helvetica", "normal");
  if (data.contactNumber) {
    doc.text(`Phone: ${data.contactNumber}`, 20, 136);
    doc.text(data.location, 20, 144);
    doc.text(`Event Date: ${data.date}`, 20, 152);
    doc.text(`Time: ${data.startTime} to ${data.endTime}`, 20, 160);
  } else {
    doc.text(data.location, 20, 136);
    doc.text(`Event Date: ${data.date}`, 20, 144);
    doc.text(`Time: ${data.startTime} to ${data.endTime}`, 20, 152);
  }

  // Service Details box
  doc.setDrawColor(240, 240, 240);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(20, 170, pageWidth - 40, 25, 2, 2, 'F');

  doc.setFont("helvetica", "bold");
  doc.text('Service Details:', 25, 180);
  doc.setFont("helvetica", "normal");
  const artistText = data.artists && data.artists.length > 0 
    ? `Live caricature session (${data.artists.length} artists)`
    : 'Live caricature session';
  doc.text(`${artistText}: INR ${data.price.toLocaleString('en-IN')}`, 25, 188);

  // Payment Details box
  doc.setDrawColor(240, 240, 240);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(20, 210, pageWidth - 40, 45, 2, 2, 'F');

  doc.setFont("helvetica", "bold");
  doc.text('Payment Details:', 25, 220);
  doc.setFont("helvetica", "normal");
  doc.text(`Total Amount: INR ${data.price.toLocaleString('en-IN')}`, 25, 228);
  doc.text(`Advance Paid: INR ${data.advancePayment.toLocaleString('en-IN')}`, 25, 236);
  doc.setTextColor(255, 0, 0);
  doc.text(`Balance Due: INR ${(data.price - data.advancePayment).toLocaleString('en-IN')}`, 25, 244);

  // Footer
  doc.setTextColor(128, 128, 128);
  doc.setFontSize(10);
  const centerText = (text: string, y: number) => {
    const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };

  centerText('Thank you for choosing Mr_Bhanu_Creates!', 270);
  centerText('For any queries, contact us at 6309703691 or mrbhanucaricatures@gmail.com', 278);

  // Bottom line
  doc.setDrawColor(0, 102, 204);
  doc.setLineWidth(0.5);
  doc.line(20, 285, pageWidth - 20, 285);

  // Save the PDF
  doc.save(`Invoice-MRBHC-${data.invoiceNumber}.pdf`);
}; 