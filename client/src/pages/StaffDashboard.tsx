import { useState, useMemo, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, DollarSign, Ticket as TicketIcon, TrendingUp, Search, Download, ExternalLink, Edit, Trash2, Upload } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CompanyHeader } from "@/components/CompanyHeader";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { toast } from "sonner";

export default function StaffDashboard() {
  const { user } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();
  const utils = trpc.useUtils();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<any>(null);
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [ticketFileUrl, setTicketFileUrl] = useState("");
  const [ticketFileName, setTicketFileName] = useState("");

  const { data: incomeEntries = [] } = trpc.income.getMy.useQuery();
  const { data: ticketEntries = [] } = trpc.ticket.getMy.useQuery();
  const { data: incomeStats } = trpc.income.getStats.useQuery();
  const { data: ticketStats } = trpc.ticket.getStats.useQuery();

  // Search tickets
  const { data: searchResults = [] } = trpc.ticket.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  const createIncomeMutation = trpc.income.create.useMutation({
    onSuccess: () => {
      utils.income.getMy.invalidate();
      utils.income.getStats.invalidate();
      toast.success('Income entry added successfully');
      setIncomeDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add income entry');
    },
  });

  const updateIncomeMutation = trpc.income.update.useMutation({
    onSuccess: () => {
      utils.income.getMy.invalidate();
      utils.income.getStats.invalidate();
      toast.success('Income entry updated successfully');
      setEditingIncome(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update income entry');
    },
  });

  const deleteIncomeMutation = trpc.income.delete.useMutation({
    onSuccess: () => {
      utils.income.getMy.invalidate();
      utils.income.getStats.invalidate();
      toast.success('Income entry deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete income entry');
    },
  });

  const createTicketMutation = trpc.ticket.create.useMutation({
    onSuccess: () => {
      utils.ticket.getMy.invalidate();
      utils.ticket.getStats.invalidate();
      toast.success('Ticket entry added successfully');
      setTicketDialogOpen(false);
      setTicketFileUrl("");
      setTicketFileName("");
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add ticket entry');
    },
  });

  const updateTicketMutation = trpc.ticket.update.useMutation({
    onSuccess: () => {
      utils.ticket.getMy.invalidate();
      utils.ticket.getStats.invalidate();
      toast.success('Ticket entry updated successfully');
      setEditingTicket(null);
      setTicketFileUrl("");
      setTicketFileName("");
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update ticket entry');
    },
  });

  const deleteTicketMutation = trpc.ticket.delete.useMutation({
    onSuccess: () => {
      utils.ticket.getMy.invalidate();
      utils.ticket.getStats.invalidate();
      toast.success('Ticket entry deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete ticket entry');
    },
  });

  const uploadTicketCopyMutation = trpc.ticket.uploadTicketCopy.useMutation({
    onSuccess: (data) => {
      setTicketFileUrl(data.url);
      setTicketFileName(data.fileName);
      toast.success('File uploaded successfully');
      setUploadingFile(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upload file');
      setUploadingFile(false);
    },
  });

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      window.location.href = '/';
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploadingFile(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const base64Data = base64.split(',')[1];

      uploadTicketCopyMutation.mutate({
        fileName: file.name,
        fileData: base64Data,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleIncomeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      type: formData.get('type') as any,
      amount: Number(formData.get('amount')),
      description: formData.get('description') as string,
      recipient: formData.get('recipient') as string || undefined,
      receivedFrom: formData.get('receivedFrom') as string || undefined,
    };

    if (editingIncome) {
      updateIncomeMutation.mutate({ ...data, id: editingIncome.id });
    } else {
      createIncomeMutation.mutate(data);
    }
  };

  const handleTicketSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      issueDate: formData.get('issueDate') as string,
      passengerName: formData.get('passengerName') as string,
      pnr: formData.get('pnr') as string,
      tripType: formData.get('tripType') as any,
      flightName: formData.get('flightName') as string,
      from: formData.get('from') as string,
      to: formData.get('to') as string,
      departureDate: formData.get('departureDate') as string,
      arrivalDate: formData.get('arrivalDate') as string,
      returnDate: formData.get('returnDate') as string || undefined,
      fromIssuer: formData.get('fromIssuer') as string,
      source: formData.get('source') as string || undefined,
      bdNumber: formData.get('bdNumber') as string || undefined,
      qrNumber: formData.get('qrNumber') as string || undefined,
      status: formData.get('status') as any,
      ticketCopyUrl: ticketFileUrl || undefined,
      ticketCopyFileName: ticketFileName || undefined,
    };

    if (editingTicket) {
      updateTicketMutation.mutate({ ...data, id: editingTicket.id });
    } else {
      createTicketMutation.mutate(data);
    }
  };

  const displayedTickets = useMemo(() => {
    return searchQuery.length > 0 ? searchResults : ticketEntries;
  }, [searchQuery, searchResults, ticketEntries]);

  // Get airline URL for PNR
  const getAirlineManageUrl = (flightName: string, pnr: string) => {
    const airline = flightName.toLowerCase();
    const urls: Record<string, string> = {
      'qatar': `https://www.qatarairways.com/en/manage-booking.html?pnr=${pnr}`,
      'emirates': `https://www.emirates.com/english/manage-booking/`,
      'etihad': `https://www.etihad.com/en/manage/`,
      'flydubai': `https://www.flydubai.com/en/plan/manage-booking`,
      'air arabia': `https://www.airarabia.com/en/manage-booking`,
    };

    for (const [key, url] of Object.entries(urls)) {
      if (airline.includes(key)) return url;
    }
    return `https://www.google.com/search?q=${encodeURIComponent(flightName + ' manage booking ' + pnr)}`;
  };

  // Download invoice
  const downloadInvoice = () => {
    const content = `
AMIN TOUCH TRADING CONTRACTING & HOSPITALITY SERVICES
========================================================

STAFF REPORT - ${user?.name}
Generated: ${new Date().toLocaleString()}

INCOME SUMMARY
--------------
Total Income: QR ${incomeStats?.totalIncome || 0}
Total Expense: QR ${incomeStats?.totalExpense || 0}
Net Income: QR ${incomeStats?.netIncome || 0}
Total OTP: QR ${incomeStats?.totalOTP || 0}

TICKET SUMMARY
--------------
Total Tickets: ${ticketStats?.total || 0}
Confirmed: ${ticketStats?.confirmed || 0}
Pending: ${ticketStats?.pending || 0}
Cancelled: ${ticketStats?.cancelled || 0}

DETAILED INCOME ENTRIES
-----------------------
${incomeEntries.map(entry => 
  `${entry.date} ${entry.time} | ${entry.type} | QR ${entry.amount} | ${entry.description}`
).join('\n')}

DETAILED TICKET ENTRIES
-----------------------
${ticketEntries.map(entry => 
  `${entry.issueDate} | ${entry.passengerName} | PNR: ${entry.pnr} | ${entry.flightName} | ${entry.from} → ${entry.to}`
).join('\n')}

========================================================
End of Report
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `staff-report-${user?.name}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Report downloaded successfully');
  };

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      
      <CompanyHeader 
        userName={user?.name}
        userRole="Staff Member"
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Income</CardTitle>
              <DollarSign className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">QR {incomeStats?.totalIncome || 0}</div>
              <p className="text-xs text-slate-400 mt-1">Net: QR {incomeStats?.netIncome || 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total OTP</CardTitle>
              <DollarSign className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">QR {incomeStats?.totalOTP || 0}</div>
              <p className="text-xs text-slate-400 mt-1">Cash transactions</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Tickets</CardTitle>
              <TicketIcon className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{ticketStats?.total || 0}</div>
              <p className="text-xs text-slate-400 mt-1">
                {ticketStats?.confirmed || 0} confirmed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Entries</CardTitle>
              <TrendingUp className="h-5 w-5 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{incomeStats?.entryCount || 0}</div>
              <p className="text-xs text-slate-400 mt-1">Total records</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Dialog open={incomeDialogOpen} onOpenChange={setIncomeDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Income/OTP Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingIncome ? 'Edit' : 'Add'} Income/OTP Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleIncomeSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      defaultValue={editingIncome?.date || new Date().toISOString().split('T')[0]}
                      className="bg-slate-800 border-slate-600"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      defaultValue={editingIncome?.time || new Date().toTimeString().slice(0, 5)}
                      className="bg-slate-800 border-slate-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" defaultValue={editingIncome?.type || "Income Add"} required>
                    <SelectTrigger className="bg-slate-800 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Income Add">Income Add</SelectItem>
                      <SelectItem value="Income Minus">Income Minus</SelectItem>
                      <SelectItem value="Income Payment">Income Payment</SelectItem>
                      <SelectItem value="Money Received">Money Received</SelectItem>
                      <SelectItem value="OTP Add">OTP Add</SelectItem>
                      <SelectItem value="OTP Minus">OTP Minus</SelectItem>
                      <SelectItem value="OTP Payment">OTP Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Amount (QR)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    defaultValue={editingIncome?.amount}
                    className="bg-slate-800 border-slate-600"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingIncome?.description}
                    className="bg-slate-800 border-slate-600"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="recipient">Recipient (for payments)</Label>
                  <Input
                    id="recipient"
                    name="recipient"
                    type="text"
                    defaultValue={editingIncome?.recipient}
                    className="bg-slate-800 border-slate-600"
                  />
                </div>

                <div>
                  <Label htmlFor="receivedFrom">Received From (for money received)</Label>
                  <Input
                    id="receivedFrom"
                    name="receivedFrom"
                    type="text"
                    defaultValue={editingIncome?.receivedFrom}
                    className="bg-slate-800 border-slate-600"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createIncomeMutation.isPending || updateIncomeMutation.isPending}>
                    {editingIncome ? 'Update' : 'Add'} Entry
                  </Button>
                  {editingIncome && (
                    <Button type="button" variant="outline" onClick={() => setEditingIncome(null)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Ticket Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingTicket ? 'Edit' : 'Add'} Ticket Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input
                      id="issueDate"
                      name="issueDate"
                      type="date"
                      defaultValue={editingTicket?.issueDate || new Date().toISOString().split('T')[0]}
                      className="bg-slate-800 border-slate-600"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="passengerName">Passenger Name</Label>
                    <Input
                      id="passengerName"
                      name="passengerName"
                      type="text"
                      defaultValue={editingTicket?.passengerName}
                      className="bg-slate-800 border-slate-600"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pnr">PNR</Label>
                    <Input
                      id="pnr"
                      name="pnr"
                      type="text"
                      defaultValue={editingTicket?.pnr}
                      className="bg-slate-800 border-slate-600"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tripType">Trip Type</Label>
                    <Select name="tripType" defaultValue={editingTicket?.tripType || "1 Way"} required>
                      <SelectTrigger className="bg-slate-800 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 Way">1 Way</SelectItem>
                        <SelectItem value="Return">Return</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="flightName">Flight Name</Label>
                  <Input
                    id="flightName"
                    name="flightName"
                    type="text"
                    defaultValue={editingTicket?.flightName}
                    className="bg-slate-800 border-slate-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from">From</Label>
                    <Input
                      id="from"
                      name="from"
                      type="text"
                      defaultValue={editingTicket?.from}
                      className="bg-slate-800 border-slate-600"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="to">To</Label>
                    <Input
                      id="to"
                      name="to"
                      type="text"
                      defaultValue={editingTicket?.to}
                      className="bg-slate-800 border-slate-600"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="departureDate">Departure Date</Label>
                    <Input
                      id="departureDate"
                      name="departureDate"
                      type="date"
                      defaultValue={editingTicket?.departureDate}
                      className="bg-slate-800 border-slate-600"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="arrivalDate">Arrival Date</Label>
                    <Input
                      id="arrivalDate"
                      name="arrivalDate"
                      type="date"
                      defaultValue={editingTicket?.arrivalDate}
                      className="bg-slate-800 border-slate-600"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="returnDate">Return Date (if applicable)</Label>
                    <Input
                      id="returnDate"
                      name="returnDate"
                      type="date"
                      defaultValue={editingTicket?.returnDate}
                      className="bg-slate-800 border-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fromIssuer">From Issuer</Label>
                    <Input
                      id="fromIssuer"
                      name="fromIssuer"
                      type="text"
                      defaultValue={editingTicket?.fromIssuer}
                      className="bg-slate-800 border-slate-600"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="source">Source/Agency</Label>
                    <Input
                      id="source"
                      name="source"
                      type="text"
                      defaultValue={editingTicket?.source}
                      className="bg-slate-800 border-slate-600"
                      placeholder="Where ticket was purchased"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bdNumber">BD Number</Label>
                    <Input
                      id="bdNumber"
                      name="bdNumber"
                      type="text"
                      defaultValue={editingTicket?.bdNumber}
                      className="bg-slate-800 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="qrNumber">QR Number</Label>
                    <Input
                      id="qrNumber"
                      name="qrNumber"
                      type="text"
                      defaultValue={editingTicket?.qrNumber}
                      className="bg-slate-800 border-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={editingTicket?.status || "Pending"} required>
                    <SelectTrigger className="bg-slate-800 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Ticket Copy (PDF/PNG/Image)</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="bg-slate-800 border-slate-600"
                    />
                    {uploadingFile && <span className="text-sm text-slate-400">Uploading...</span>}
                    {ticketFileName && (
                      <span className="text-sm text-green-400">✓ {ticketFileName}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createTicketMutation.isPending || updateTicketMutation.isPending || uploadingFile}>
                    {editingTicket ? 'Update' : 'Add'} Ticket
                  </Button>
                  {editingTicket && (
                    <Button type="button" variant="outline" onClick={() => {
                      setEditingTicket(null);
                      setTicketFileUrl("");
                      setTicketFileName("");
                    }}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Button onClick={downloadInvoice} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 bg-slate-900/80 backdrop-blur-sm border-slate-700">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search tickets by passenger name or PNR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="income" className="space-y-6">
          <TabsList className="bg-slate-900/80 border-slate-700">
            <TabsTrigger value="income" className="data-[state=active]:bg-slate-700">
              Income/OTP Entries
            </TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-slate-700">
              Ticket Sales
            </TabsTrigger>
          </TabsList>

          <TabsContent value="income">
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">My Income & OTP Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Date</TableHead>
                        <TableHead className="text-slate-300">Time</TableHead>
                        <TableHead className="text-slate-300">Type</TableHead>
                        <TableHead className="text-slate-300">Amount</TableHead>
                        <TableHead className="text-slate-300">Description</TableHead>
                        <TableHead className="text-slate-300">Recipient/From</TableHead>
                        <TableHead className="text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incomeEntries.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-slate-400">
                            No entries found
                          </TableCell>
                        </TableRow>
                      ) : (
                        incomeEntries.map((entry) => (
                          <TableRow key={entry.id} className="border-slate-700">
                            <TableCell className="text-white">{entry.date}</TableCell>
                            <TableCell className="text-white">{entry.time}</TableCell>
                            <TableCell>
                              <Badge variant={
                                entry.type.includes('Add') || entry.type === 'Money Received' ? 'default' : 
                                entry.type.includes('Minus') ? 'destructive' : 'secondary'
                              }>
                                {entry.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-white font-medium">QR {entry.amount}</TableCell>
                            <TableCell className="text-slate-300">{entry.description}</TableCell>
                            <TableCell className="text-slate-300">
                              {entry.recipient || entry.receivedFrom || '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingIncome(entry);
                                    setIncomeDialogOpen(true);
                                  }}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    if (confirm('Are you sure you want to delete this entry?')) {
                                      deleteIncomeMutation.mutate({ id: entry.id });
                                    }
                                  }}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">My Ticket Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Issue Date</TableHead>
                        <TableHead className="text-slate-300">Passenger</TableHead>
                        <TableHead className="text-slate-300">PNR</TableHead>
                        <TableHead className="text-slate-300">Flight</TableHead>
                        <TableHead className="text-slate-300">Route</TableHead>
                        <TableHead className="text-slate-300">Source</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedTickets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-slate-400">
                            No tickets found
                          </TableCell>
                        </TableRow>
                      ) : (
                        displayedTickets.map((entry) => (
                          <TableRow key={entry.id} className="border-slate-700">
                            <TableCell className="text-white">{entry.issueDate}</TableCell>
                            <TableCell className="text-white">{entry.passengerName}</TableCell>
                            <TableCell>
                              <a
                                href={getAirlineManageUrl(entry.flightName, entry.pnr)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                              >
                                {entry.pnr}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </TableCell>
                            <TableCell className="text-white">{entry.flightName}</TableCell>
                            <TableCell className="text-slate-300">
                              {entry.from} → {entry.to}
                            </TableCell>
                            <TableCell className="text-slate-300">{entry.source || '-'}</TableCell>
                            <TableCell>
                              <Badge variant={
                                entry.status === 'Confirmed' ? 'default' :
                                entry.status === 'Pending' ? 'secondary' : 'destructive'
                              }>
                                {entry.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {entry.ticketCopyUrl && (
                                  <a
                                    href={entry.ticketCopyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-400 hover:text-green-300"
                                    title="Download ticket copy"
                                  >
                                    <Download className="h-4 w-4" />
                                  </a>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingTicket(entry);
                                    setTicketFileUrl(entry.ticketCopyUrl || "");
                                    setTicketFileName(entry.ticketCopyFileName || "");
                                    setTicketDialogOpen(true);
                                  }}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    if (confirm('Are you sure you want to delete this ticket?')) {
                                      deleteTicketMutation.mutate({ id: entry.id });
                                    }
                                  }}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <ChangePasswordModal />
    </div>
  );
}
