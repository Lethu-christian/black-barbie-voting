import React from 'react';
import { Sparkles, Trophy, Users } from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative pt-32 pb-20 px-6 overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-luxury-rose/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-luxury-gold/10 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 border border-luxury-rose text-luxury-deep font-semibold mb-8 backdrop-blur-sm animate-bounce">
                    <Sparkles className="w-4 h-4" />
                    <span>New Competitions Live!</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black text-luxury-slate mb-6 leading-tight">
                    Your Vote, <br />
                    <span className="bg-gradient-to-r from-luxury-deep via-luxury-pink to-luxury-gold bg-clip-text text-transparent">
                        Your Choice
                    </span>
                </h1>

                <p className="text-xl text-slate-500 max-w-2xl mb-12">
                    Experience the most premium voting platform. Supporting your favorite contestants with elegance and security.
                </p>

                <div className="flex flex-col md:flex-row gap-4 items-center mb-16">
                    <button className="px-10 py-4 bg-luxury-deep text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-[0_20px_40px_rgba(157,23,77,0.3)] transition-all transform hover:-translate-y-1">
                        Browse Contestants
                    </button>
                    <button className="px-10 py-4 bg-white text-luxury-deep border-2 border-luxury-rose rounded-2xl font-bold text-lg hover:bg-luxury-rose/20 transition-all">
                        How it Works
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                    {[
                        { icon: <Trophy className="w-6 h-6" />, label: "50+ Competitions", desc: "Successfully completed" },
                        { icon: <Users className="w-6 h-6" />, label: "10k+ Voters", desc: "Trusted global community" },
                        { icon: <Sparkles className="w-6 h-6" />, label: "Real-time Results", desc: "Dynamic live updates" }
                    ].map((stat, i) => (i === 1 ? (
                        <div key={i} className="p-8 rounded-3xl bg-white border border-luxury-rose shadow-xl transform scale-110">
                            <div className="w-12 h-12 bg-luxury-pink/20 rounded-2xl flex items-center justify-center text-luxury-deep mb-4 mx-auto">
                                {stat.icon}
                            </div>
                            <h3 className="font-bold text-xl text-luxury-slate">{stat.label}</h3>
                            <p className="text-sm text-slate-400">{stat.desc}</p>
                        </div>
                    ) : (
                        <div key={i} className="p-8 rounded-3xl bg-white/60 border border-white/40 backdrop-blur-sm hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-luxury-rose/40 rounded-2xl flex items-center justify-center text-luxury-deep mb-4 mx-auto">
                                {stat.icon}
                            </div>
                            <h3 className="font-bold text-xl text-luxury-slate">{stat.label}</h3>
                            <p className="text-sm text-slate-400">{stat.desc}</p>
                        </div>
                    )))}
                </div>
            </div>
        </div>
    );
};

export default Hero;
