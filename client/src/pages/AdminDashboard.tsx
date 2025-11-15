import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Ticket, Users, Search, Download, ExternalLink, Edit, Trash2 } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CompanyHeader } from "@/components/CompanyHeader";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const { data: incomeEntries = [], refetch: refetchIncome } = trpc.income.getAll.useQuery();
  const { data: ticketEntries = [], refetch: refetchTickets } = trpc.ticket.getAll.useQuery();
  const { data: incomeStats } = trpc.income.getAdminStats.useQuery();
  const { data: ticketStats } = trpc.ticket.getAdminStats.useQuery();

  // Search tickets
  const { data: searchResults = [] } = trpc.ticket.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      window.location.href = '/';
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Get unique staff names
  const staffNames = useMemo(() => {
    const names = new Set(incomeEntries.map(e => e.userName));
    return Array.from(names);
  }, [incomeEntries]);

  // Filter entries
  const filteredIncomeEntries = useMemo(() => {
    return incomeEntries.filter(entry => {
      if (selectedStaff !== "all" && entry.userName !== selectedStaff) return false;
      if (selectedMonth !== "all") {
        const entryMonth = entry.date.split('-')[1];
        if (entryMonth !== selectedMonth) return false;
      }
      if (selectedYear !== "all") {
        const entryYear = entry.date.split('-')[0];
        if (entryYear !== selectedYear) return false;
      }
      return true;
    });
  }, [incomeEntries, selectedStaff, selectedMonth, selectedYear]);

  const filteredTicketEntries = useMemo(() => {
    let entries = searchQuery.length > 0 ? searchResults : ticketEntries;
    
    return entries.filter(entry => {
      if (selectedStaff !== "all" && entry.userName !== selectedStaff) return false;
      if (selectedMonth !== "all") {
        const entryMonth = entry.issueDate.split('-')[1];
        if (entryMonth !== selectedMonth) return false;
      }
      if (selectedYear !== "all") {
        const entryYear = entry.issueDate.split('-')[0];
        if (entryYear !== selectedYear) return false;
      }
      return true;
    });
  }, [ticketEntries, searchResults, searchQuery, selectedStaff, selectedMonth, selectedYear]);

  // Download invoice
  const downloadInvoice = () => {
    const content = `
AMIN TOUCH TRADING CONTRACTING & HOSPITALITY SERVICES
========================================================

INVOICE REPORT
Generated: ${new Date().toLocaleString()}
Period: ${selectedMonth !== 'all' ? `Month ${selectedMonth}` : 'All Months'} ${selectedYear}
Staff: ${selectedStaff !== 'all' ? selectedStaff : 'All Staff'}

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
${filteredIncomeEntries.map(entry => 
  `${entry.date} ${entry.time} | ${entry.userName} | ${entry.type} | QR ${entry.amount} | ${entry.description}`
).join('\n')}

DETAILED TICKET ENTRIES
-----------------------
${filteredTicketEntries.map(entry => 
  `${entry.issueDate} | ${entry.passengerName} | PNR: ${entry.pnr} | ${entry.flightName} | ${entry.from} → ${entry.to}`
).join('\n')}

========================================================
End of Report
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${selectedYear}-${selectedMonth}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Invoice downloaded successfully');
  };

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

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      
      <CompanyHeader 
        userName={user?.name}
        userRole="Administrator"
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
              <Ticket className="h-5 w-5 text-purple-400" />
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
              <CardTitle className="text-sm font-medium text-slate-300">Total Staff</CardTitle>
              <Users className="h-5 w-5 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{staffNames.length}</div>
              <p className="text-xs text-slate-400 mt-1">Active members</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-slate-900/80 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Staff</label>
                <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Staff</SelectItem>
                    {staffNames.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">Month</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {[2024, 2025, 2026].map(year => (
                      <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">Actions</label>
                <Button onClick={downloadInvoice} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <CardTitle className="text-white">Income & OTP Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Date</TableHead>
                        <TableHead className="text-slate-300">Time</TableHead>
                        <TableHead className="text-slate-300">Staff</TableHead>
                        <TableHead className="text-slate-300">Type</TableHead>
                        <TableHead className="text-slate-300">Amount</TableHead>
                        <TableHead className="text-slate-300">Description</TableHead>
                        <TableHead className="text-slate-300">Recipient/From</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIncomeEntries.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-slate-400">
                            No entries found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredIncomeEntries.map((entry) => (
                          <TableRow key={entry.id} className="border-slate-700">
                            <TableCell className="text-white">{entry.date}</TableCell>
                            <TableCell className="text-white">{entry.time}</TableCell>
                            <TableCell className="text-white">{entry.userName}</TableCell>
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
                <CardTitle className="text-white">Ticket Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Issue Date</TableHead>
                        <TableHead className="text-slate-300">Staff</TableHead>
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
                      {filteredTicketEntries.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-slate-400">
                            No tickets found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTicketEntries.map((entry) => (
                          <TableRow key={entry.id} className="border-slate-700">
                            <TableCell className="text-white">{entry.issueDate}</TableCell>
                            <TableCell className="text-white">{entry.userName}</TableCell>
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
                                  >
                                    <Download className="h-4 w-4" />
                                  </a>
                                )}
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
