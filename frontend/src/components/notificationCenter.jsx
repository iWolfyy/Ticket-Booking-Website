import React, { useState, useEffect } from "react";
import { Bell, Calendar, Megaphone, Ticket, Info, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/axios";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/activities');
      setNotifications(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await apiClient.patch(`/activities/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.patch('/activities/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'event': return <Calendar className="text-blue-500" size={16} />;
      case 'announcement': return <Megaphone className="text-yellow-500" size={16} />;
      case 'booking': return <Ticket className="text-green-500" size={16} />;
      default: return <Info className="text-zinc-500" size={16} />;
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group rounded-full hover:bg-accent/50">
          <Bell size={20} className="text-muted-foreground transition-colors group-hover:text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-background animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0 shadow-2xl border-muted/50 rounded-xl bg-card/95 backdrop-blur-md">
        <DropdownMenuLabel className="p-4 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-xs uppercase tracking-widest">Notifications</span>
            <span className="text-[10px] text-muted-foreground font-medium">{unreadCount} Unread</span>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" className="h-6 text-[9px] uppercase font-bold text-primary px-2" onClick={handleMarkAllRead}>
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-[350px]">
          <AnimatePresence initial={false}>
            {notifications.length > 0 ? (
              notifications.map((n, i) => (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                  className={cn(
                    "p-4 flex gap-3 hover:bg-muted/50 cursor-pointer transition-all border-b border-muted/20 relative group/item",
                    !n.isRead && "bg-primary/[0.03]"
                  )}
                >
                  <div className="mt-1 flex-shrink-0">{getIcon(n.type)}</div>
                  <div className="space-y-1 pr-4">
                    <p className="text-[11px] font-bold leading-none tracking-tight">{n.title}</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{n.description}</p>
                    <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tighter">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!n.isRead && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Circle size={6} className="fill-primary text-primary" />
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-48 space-y-2 opacity-40">
                <Bell size={32} strokeWidth={1} />
                <p className="text-[10px] font-bold uppercase tracking-widest">All caught up</p>
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}