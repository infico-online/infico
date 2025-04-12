import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Search, Filter, Twitter, Send, Youtube, Instagram, Wallet, TrendingUp, BadgeDollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";


function TrendingInvestors() {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [showNav, setShowNav] = React.useState(true);
  const [sortBy, setSortBy] = React.useState("invested");
  const [filters, setFilters] = React.useState({
    activity: "all",
    type: "all",
    topic: "all",
    language: "all"
  });

  const investors = [
    {
      id: "1",
      name: "@crypto_whale",
      invested: "500K",
      investedAmount: 500000,
      activeIcos: 12,
      profit: "125K",
      isWhale: true,
      interests: ["Crypto", "Finance"],
      language: "English"
    },
    {
      id: "2",
      name: "@tech_investor",
      invested: "250K",
      investedAmount: 250000,
      activeIcos: 8,
      profit: "45K",
      isAngel: true,
      interests: ["Tech", "AI"],
      language: "English"
    },
    {
      id: "3",
      name: "@finance_master",
      invested: "750K",
      investedAmount: 750000,
      activeIcos: 15,
      profit: "180K",
      isWhale: true,
      interests: ["Finance", "Crypto"],
      language: "Russian"
    },
    {
      id: "4",
      name: "@smart_trader",
      invested: "150K",
      investedAmount: 150000,
      activeIcos: 5,
      profit: "28K",
      interests: ["Trading", "Crypto"],
      language: "English"
    },
    {
      id: "5",
      name: "@ico_hunter",
      invested: "200K",
      investedAmount: 200000,
      activeIcos: 7,
      profit: "35K",
      interests: ["Crypto", "Tech"],
      language: "Russian"
    }
  ];

  const [sortedInvestors, setSortedInvestors] = React.useState(investors);

  React.useEffect(() => {
    let prevScroll = window.pageYOffset;
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      setShowNav(prevScroll > currentScroll);
      prevScroll = currentScroll;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const sorted = [...investors].sort((a, b) => {
      switch (sortBy) {
        case "invested":
          return b.investedAmount - a.investedAmount;
        case "returns":
          return b.returns - a.returns;
        case "activity":
          return b.activeIcos - a.activeIcos;
        default:
          return 0;
      }
    });
    setSortedInvestors(sorted);
  }, [sortBy]);

  const InvestorCard = React.memo(({ investor }) => (
    <Card className="p-4">
      <div className="relative">
        <div className="absolute right-0 top-0 flex flex-col items-end gap-0.5">
          {investor.isWhale && (
            <span className="px-2 py-0.5 bg-black text-white text-xs rounded-full whitespace-nowrap">
              WHALE
            </span>
          )}
          {investor.isAngel && (
            <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-xs rounded-full whitespace-nowrap">
              ANGEL
            </span>
          )}
        </div>
        <div>
          <CardTitle className="text-base pr-28 mb-1">{investor.name}</CardTitle>
          <div className="text-xs text-muted-foreground mb-1">
            {investor.language} | {investor.interests.join(", ")}
          </div>
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
            <Wallet className="h-3 w-3" />
            <span>{investor.invested} USDT invested</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BadgeDollarSign className="h-3 w-3" />
            <span>{investor.activeIcos} active ICOs</span>
            <div className="ml-auto flex items-center gap-1 text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>{investor.profit} USDT profit</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">
              infico<span className="text-muted-foreground">.online</span>
            </h1>
            <div className="flex items-center gap-2">
              {[Twitter, Send, Youtube, Instagram].map((Icon, i) => (
                <Button key={i} variant="ghost" size="icon" className="h-8 w-8">
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 pb-24 space-y-3">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 text-center mt-4">
          <span className="text-gray-600">Your Ad Could Be Here • Contact Us</span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search investors..." className="pl-10" />
        </div>

        <div className="grid grid-cols-4 gap-0.5">
          {["Investors", "ICOs", "Pages", "Channels"].map(type => (
            <Button
              key={type}
              variant={type === "Investors" ? "default" : "outline"}
              className="h-7 px-1 text-[9px] font-medium tracking-tight"
            >
              {type}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="invested">By Amount</SelectItem>
              <SelectItem value="returns">By Returns</SelectItem>
              <SelectItem value="activity">By Activity</SelectItem>
            </SelectContent>
          </Select>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Topic</div>
                  <div className="grid grid-cols-2 gap-2">
                    {["All", "Crypto", "Tech", "Finance", "Trading", "AI"].map((topic) => (
                      <Button
                        key={topic}
                        variant={filters.topic === topic.toLowerCase() ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilters({...filters, topic: topic.toLowerCase()})}
                        className="w-full"
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Language</div>
                  <div className="grid grid-cols-2 gap-2">
                    {["All", "English", "Russian"].map((lang) => (
                      <Button
                        key={lang}
                        variant={filters.language === lang.toLowerCase() ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilters({...filters, language: lang.toLowerCase()})}
                        className="w-full"
                      >
                        {lang}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Activity Level</div>
                  <div className="grid grid-cols-2 gap-2">
                    {["All", "High", "Medium", "Low"].map((activity) => (
                      <Button
                        key={activity}
                        variant={filters.activity === activity.toLowerCase() ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilters({...filters, activity: activity.toLowerCase()})}
                        className="w-full"
                      >
                        {activity}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Investor Type</div>
                  <div className="grid grid-cols-2 gap-2">
                    {["All", "Whale", "Angel", "Professional", "Regular"].map((type) => (
                      <Button
                        key={type}
                        variant={filters.type === type.toLowerCase() ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilters({...filters, type: type.toLowerCase()})}
                        className="w-full"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <motion.div className="space-y-3" layout>
          <AnimatePresence>
            {sortedInvestors.map((investor) => (
              <motion.div
                key={investor.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <InvestorCard investor={investor} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-background"
        animate={{ y: showNav ? 0 : 100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 pb-2 pt-2 border-t bg-background">
          <div className="grid grid-cols-3 gap-2">
            <Button className="w-full" size="lg">Create ICO</Button>
            <Button className="w-full" size="lg">Create Page</Button>
            <Button className="w-full" size="lg">Start Invest</Button>
          </div>
        </div>
        
        <nav className="px-4 py-2 border-t bg-background">
          <div className="flex justify-around">
            {["Home", "Cabinet", "Channels", "More"].map((item) => (
              <Button
                key={item}
                variant={item === "Home" ? "default" : "ghost"}
                className="flex-col gap-1 h-auto py-2"
              >
                <span className="text-xs">{item}</span>
              </Button>
            ))}
          </div>
        </nav>
      </motion.div>
    </div>
  );
}

export default TrendingInvestors;
