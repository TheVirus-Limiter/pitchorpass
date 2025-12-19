import { motion } from "framer-motion";
import { type Pitch } from "@shared/routes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // We'll create a simple badge inline if needed or update later. Let's assume standard badge exists or use div.
import { Users, TrendingUp, DollarSign, MapPin } from "lucide-react";


interface PitchCardProps {
  pitch: Pitch;
  round: number;
}

export function PitchCard({ pitch, round }: PitchCardProps) {
  const { founder, startup, ask } = pitch;

  const container = {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden bg-card/80 backdrop-blur-sm border-white/5 relative z-10 min-h-[500px] flex flex-col">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col"
      >
        {/* Header - Startup Identity */}
        <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 border-b border-border/50">
          <div className="flex justify-between items-start mb-2">
            <motion.div variants={item}>
              <h4 className="text-sm font-medium text-primary uppercase tracking-wider mb-1">Round {round}/10</h4>
              <CardTitle className="text-4xl text-gradient-primary">{startup.name}</CardTitle>
            </motion.div>
            <motion.div variants={item} className="text-right">
               <Badge className="bg-primary/20 text-primary border border-primary/20">
                 Seeking ${ask.toLocaleString()}
               </Badge>
            </motion.div>
          </div>
          <motion.p variants={item} className="text-lg text-muted-foreground font-medium leading-relaxed">
            "{startup.pitch}"
          </motion.p>
        </div>

        <CardContent className="p-6 space-y-8 flex-1">
          {/* Founder Section */}
          <motion.div variants={item} className="flex items-center gap-4 bg-secondary/30 p-4 rounded-xl border border-white/5">
            <div className="relative">
              <img 
                src={founder.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80"} 
                alt={founder.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/50 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border border-border">
                <MapPin className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Founder</p>
              <h3 className="text-xl font-bold">{founder.name}</h3>
              <p className="text-sm text-muted-foreground">{founder.country}</p>
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div variants={item} className="grid grid-cols-3 gap-4">
            <div className="bg-secondary/20 p-4 rounded-xl text-center border border-white/5 hover:bg-secondary/30 transition-colors">
              <Users className="w-5 h-5 mx-auto mb-2 text-blue-400" />
              <div className="text-xl font-bold font-mono">{startup.traction.users.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Active Users</div>
            </div>
            <div className="bg-secondary/20 p-4 rounded-xl text-center border border-white/5 hover:bg-secondary/30 transition-colors">
              <TrendingUp className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
              <div className="text-xl font-bold font-mono">+{startup.traction.monthlyGrowth}%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">MoM Growth</div>
            </div>
            <div className="bg-secondary/20 p-4 rounded-xl text-center border border-white/5 hover:bg-secondary/30 transition-colors">
              <DollarSign className="w-5 h-5 mx-auto mb-2 text-yellow-400" />
              <div className="text-xl font-bold font-mono">${(startup.traction.revenue / 1000).toFixed(0)}k</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">MRR</div>
            </div>
          </motion.div>

          {/* Market Context */}
          <motion.div variants={item} className="bg-accent/5 border border-accent/10 p-5 rounded-xl">
             <h5 className="text-sm font-semibold text-accent mb-2 uppercase tracking-wider">Market Opportunity</h5>
             <p className="text-muted-foreground text-sm leading-relaxed">
               {startup.market}
             </p>
          </motion.div>
        </CardContent>
      </motion.div>
    </Card>
  );
}
