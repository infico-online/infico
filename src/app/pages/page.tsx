'use client';

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion";

import { Search, Filter, Users, Eye, Twitter, Send, Youtube, Instagram, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";


function TrendingPages() {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [showNav, setShowNav] = React.useState(true);
  const [sortBy, setSortBy] = React.useState("views");
  const [filters, setFilters] = React.useState({
    topic: "all",
    language: "all",
  });

  const pages = [
    {
      id: "1",
      name: "@crypto_advice",
      category: "Crypto",
      language: "English",
      views: "2.5M",
      viewsCount: 2500000,
      growth: 25,
      subscribers: "156K",
      hasIco: true,
    },
    {
      id: "2",
      name: "@tech_insights",
      category: "Tech",
      language: "English",
      views: "1.8M",
      viewsCount: 1800000,
      growth: 18,
      subscribers: "98K",
      hasIco: true,
    },
    {
      id: "3",
      name: "@finance_daily",
      category: "Finance",
      language: "English",
      views: "3.1M",
      viewsCount: 3100000,
      growth: 32,
      subscribers: "220K",
      hasIco: true,
    },
    {
      id: "4",
      name: "@art_gallery",
      category: "Art",
      language: "English",
      views: "1.2M",
      viewsCount: 1200000,
      growth: 15,
      subscribers: "75K",
      hasIco: false,
    },
    {
      id: "5",
      name: "@travel_world",
      category: "Travel",
      language: "English",
      views: "900K",
      viewsCount: 900000,
      growth: 22,
      subscribers: "62K",
      hasIco: false,
    }
  ];

  const [sortedPages, setSortedPages] = React.useState(pages);

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

  const PageCard = ({ page }) => (
    <Card className="p-4">
      <div className="relative">
        <div className="absolute right-0 top-0 flex flex-col items-end gap-0.5">
          {page.id === "1" && (
            <span className="px-2 py-0.5 bg-black text-white text-xs rounded-full whitespace-nowrap">
              PREMIUM
            </span>
          )}
          {page.id === "2" && !page.hasIco && (
            <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-xs rounded-full whitespace-nowrap">
              ANGEL
            </span>
          )}
          {page.hasIco && (
            <span className="px-2 py-0.5 bg-black text-white text-xs rounded-full whitespace-nowrap">
              Active ICO
            </span>
          )}
        </div>
        <div>
          <CardTitle className="text-base pr-28 mb-1">{page.name}</CardTitle>
          <div className="text-xs text-muted-foreground mb-1">
            {page.category}/{page.language}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Users className="h-3 w-3" />
            <span>{page.subscribers} subscribers</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Eye className="h-3 w-3" />
            <span>{page.views} views</span>
            <div className="ml-auto flex items-center gap-1 text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>+{page.growth}% weekly</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

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
          <Input placeholder="Search pages..." className="pl-10" />
        </div>

        <div className="grid grid-cols-4 gap-0.5">
          {["Investors", "ICOs", "Pages", "Channels"].map(type => (
            <Button
              key={type}
              variant={type === "Pages" ? "default" : "outline"}
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
              <SelectItem value="views">By Views</SelectItem>
              <SelectItem value="growth">By Growth</SelectItem>
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
                    {["All", "Crypto", "Tech", "Finance", "Art", "Travel"].map((topic) => (
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
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <motion.div className="space-y-3" layout>
          <AnimatePresence>
            {sortedPages.map((page) => (
              <motion.div
                key={page.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <PageCard page={page} />
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

export default TrendingPages;
