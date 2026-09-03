export default function Test() { return (<><XRayCard className="reveal-on-scroll" style={{ transitionDelay: "200ms" }}>
<article className="project-card group rounded-2xl bg-surface-container/70 border border-outline-variant hover:border-cyber-blue/80 overflow-hidden backdrop-blur-md transition-all duration-500 flex flex-col justify-between h-full">
{/* Terminal Mockup Window Header */}
<div className="h-8 px-4 bg-surface-container-highest/90 flex items-center justify-between border-b border-outline-variant/60 font-mono text-xs">
<div className="flex items-center gap-2">
<span className="window-dot w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
<span className="window-dot w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
<span className="window-dot w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
<span className="text-on-surface-variant ml-2 text-[11px]">app.pokedex.archive</span>
</div>
<span className="text-cyber-blue text-[11px] font-bold tracking-wider">POKE-API ENGINE</span>
</div>
{/* Pokedex Retro Card Preview Mockup (Faithfully recreating Image 2 visual) */}
<div className="relative h-60 w-full bg-surface-dim overflow-hidden p-3 flex flex-col justify-center group-hover:bg-surface-dim/80 transition-colors">
<div className="grid grid-cols-4 gap-2">
{/* Bulbasaur */}
<div className="rounded-lg bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 p-2 flex flex-col items-center text-center transition-all hover:scale-105 duration-200">
<div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">#01</div>
<span className="font-mono text-[10px] text-emerald-300 mt-1 font-semibold">bulbasaur</span>
</div>
{/* Ivysaur */}
<div className="rounded-lg bg-teal-950/40 border border-teal-500/30 hover:border-teal-400 p-2 flex flex-col items-center text-center transition-all hover:scale-105 duration-200">
<div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-mono text-xs font-bold">#02</div>
<span className="font-mono text-[10px] text-teal-300 mt-1 font-semibold">ivysaur</span>
</div>
{/* Venusaur */}
<div className="rounded-lg bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 p-2 flex flex-col items-center text-center transition-all hover:scale-105 duration-200">
<div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">#03</div>
<span className="font-mono text-[10px] text-cyan-300 mt-1 font-semibold">venusaur</span>
</div>
{/* Charmander */}
<div className="rounded-lg bg-rose-950/40 border border-rose-500/30 hover:border-rose-400 p-2 flex flex-col items-center text-center transition-all hover:scale-105 duration-200">
<div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-mono text-xs font-bold">#04</div>
<span className="font-mono text-[10px] text-rose-300 mt-1 font-semibold">charmander</span>
</div>
</div>
{/* Second Row Mockup */}
<div className="grid grid-cols-4 gap-2 mt-2">
<div className="rounded-lg bg-orange-950/40 border border-orange-500/30 hover:border-orange-400 p-2 flex flex-col items-center text-center transition-all hover:scale-105 duration-200">
<div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-mono text-xs font-bold">#05</div>
<span className="font-mono text-[10px] text-orange-300 mt-1 font-semibold">charmeleon</span>
</div>
<div className="rounded-lg bg-red-950/40 border border-red-500/30 hover:border-red-400 p-2 flex flex-col items-center text-center transition-all hover:scale-105 duration-200">
<div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-mono text-xs font-bold">#06</div>
<span className="font-mono text-[10px] text-red-300 mt-1 font-semibold">charizard</span>
</div>
<div className="rounded-lg bg-sky-950/40 border border-sky-500/30 hover:border-sky-400 p-2 flex flex-col items-center text-center transition-all hover:scale-105 duration-200">
<div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 font-mono text-xs font-bold">#07</div>
<span className="font-mono text-[10px] text-sky-300 mt-1 font-semibold">squirtle</span>
</div>
<div className="rounded-lg bg-blue-950/40 border border-blue-500/30 hover:border-blue-400 p-2 flex flex-col items-center text-center transition-all hover:scale-105 duration-200">
<div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-mono text-xs font-bold">#08</div>
<span className="font-mono text-[10px] text-blue-300 mt-1 font-semibold">wartortle</span>
</div>
</div>
<div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-50 pointer-events-none"></div>
</div>
{/* Project Details (Authentic to Image 2) */}
<div className="p-6 flex flex-col gap-4 flex-1 justify-between">
<div>
<h3 className="text-2xl font-display font-bold text-white group-hover:text-cyber-blue transition-colors">
                Pokedex-App
              </h3>
<p className="text-on-surface-variant text-sm mt-2 leading-relaxed">
                A classic Pokedex app to search and view details. Integrates the PokeAPI for stats, evolutions, abilities, and dynamic card styling based on creature types.
              </p>
</div>
{/* Tech Pills (Exact match from Image 2) */}
<div className="flex flex-wrap items-center gap-2 pt-2">
<span className="px-2.5 py-1 rounded-full font-mono text-xs bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 hover:border-cyber-blue transition-colors">React</span>
<span className="px-2.5 py-1 rounded-full font-mono text-xs bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 hover:border-cyber-cyan transition-colors">CSS</span>
<span className="px-2.5 py-1 rounded-full font-mono text-xs bg-amber-400/10 text-amber-300 border border-amber-400/20 hover:border-amber-400 transition-colors">JavaScript</span>
</div>
{/* Action Link buttons */}
<div className="flex items-center gap-4 pt-3 border-t border-outline-variant/60 font-mono text-xs">
<a className="text-cyber-blue hover:underline flex items-center gap-1 group/link" href="https://pokemon-teal-eight-81.vercel.app/pokemon">
  <span>Launch Pokedex</span>
<span className="material-symbols-outlined text-[14px] transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">open_in_new</span>
</a>
<a className="text-on-surface-variant hover:text-white flex items-center gap-1 group/link" href="#">
<span className="material-symbols-outlined text-[14px] transition-transform duration-200 group-hover/link:rotate-12">code</span>
<span>GitHub Repo</span>
</a>
</div>
</div>
</article>
</XRayCard></>); }