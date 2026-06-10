import { useState, useEffect, useCallback } from "react";

const B = {
  navy:"#0D1B2A",navy2:"#152333",navy3:"#1e3347",
  gold:"#C9A66B",gold2:"#b8924e",
  paper:"#F5F1EA",paper2:"#EDE8DF",white:"#FDFBF7",
  text4:"#b8b0a4",text3:"#7a7268",
  rule:"rgba(13,27,42,0.08)",ruleN:"rgba(245,241,234,0.07)",
  green:"#2e7d32",greenP:"rgba(46,125,50,0.08)",
  amber:"#b45309",amberP:"rgba(180,83,9,0.07)",
  red:"#b91c1c",redP:"rgba(185,28,28,0.07)",
  blue:"#1a5276",blueP:"rgba(26,82,118,0.07)",
};

const MARKETS=[
  {id:"residential",  label:"Residential",          icon:"\u2302",launch:true, color:B.green},
  {id:"energy",       label:"Energy & Infrastructure",icon:"\u25c8",launch:true, color:B.amber},
  {id:"digital",      label:"Digital & Technology",  icon:"\u25a3",launch:true, color:B.blue},
  {id:"commercial",   label:"Commercial & Logistics", icon:"\u25ab",launch:false,color:B.text3},
  {id:"mixeduse",     label:"Mixed Use",             icon:"\u229e",launch:false,color:"#6b21a8"},
  {id:"agricultural", label:"Agricultural & Rural",  icon:"\u273f",launch:false,color:B.green},
  {id:"hospitality",  label:"Hospitality & Leisure", icon:"\u25c9",launch:false,color:B.gold2},
  {id:"healthcare",   label:"Healthcare & Education",icon:"\u2299",launch:false,color:B.text3},
];

const ASSET_CLASSES=[
  {id:"residential", label:"Residential",          icon:"\u2302",color:"#4ade80",group:"Strategic"},
  {id:"solar_bess",  label:"Solar / BESS",          icon:"\u25c8",color:"#facc15",group:"Strategic"},
  {id:"data_centre", label:"Data Centre",           icon:"\u25a3",color:"#60a5fa",group:"Strategic"},
  {id:"logistics",   label:"Logistics / Industrial",icon:"\u25ab",color:"#f97316",group:"Strategic"},
  {id:"ev_charging", label:"EV Charging Hub",       icon:"\u26a1",color:"#a78bfa",group:"Strategic"},
  {id:"hydrogen",    label:"Hydrogen / CCUS",       icon:"\u25ce",color:"#34d399",group:"Strategic"},
  {id:"bng",         label:"BNG / Carbon Credits",  icon:"\u273f",color:"#86efac",group:"Strategic"},
  {id:"self_storage",label:"Self Storage",          icon:"\u25e7",color:"#fb923c",group:"Strategic"},
  {id:"office_resi", label:"Office \u2192 Residential",icon:"\u229e",color:"#38bdf8",group:"Urban"},
  {id:"hotel",       label:"Hotel",                 icon:"\u25c9",color:"#e879f9",group:"Urban"},
  {id:"pbsa",        label:"PBSA",                  icon:"\u25d1",color:"#fb7185",group:"Urban"},
  {id:"coliving_btr",label:"Co-Living / BTR",       icon:"\u229f",color:"#fbbf24",group:"Urban"},
  {id:"later_living",label:"Later Living",          icon:"\u2299",color:"#6ee7b7",group:"Urban"},
  {id:"dc_cluster",  label:"Data Centre Cluster",   icon:"\u2666",color:"#818cf8",group:"Strategic"},
];

const SITE_STATUSES=[
  {id:"scored",     label:"Scored",          color:B.blue},
  {id:"available",  label:"Available",        color:B.blue},
  {id:"claimed",    label:"Claimed",          color:B.amber},
  {id:"approached", label:"Approached",       color:B.amber},
  {id:"negotiating",label:"Negotiating",      color:B.gold2},
  {id:"agreed",     label:"Agreement Signed", color:B.green},
  {id:"planning",   label:"In Planning",      color:B.blue},
  {id:"consented",  label:"Consented",        color:B.green},
  {id:"completed",  label:"Completed",        color:B.green},
  {id:"onhold",     label:"On Hold",          color:B.text4},
  {id:"dead",       label:"Dead",             color:B.red},
];

const TIERS=[
  {id:"T1",label:"Tier 1 \u2014 Prime",   color:B.green},
  {id:"T2",label:"Tier 2 \u2014 Strong",  color:B.gold2},
  {id:"T3",label:"Tier 3 \u2014 Marginal",color:B.amber},
  {id:"TF",label:"Failed Gate",            color:B.red},
  {id:"--",label:"Unscored",              color:B.text4},
];

const PROB_BANDS=[
  {id:"high",    label:"High Probability",range:"70\u2013100%",color:B.green,desc:"Strong policy case, clean constraints. Proceed with confidence."},
  {id:"moderate",label:"Moderate",        range:"45\u201369%", color:B.amber,desc:"Viable but material risk factors. Expert input required."},
  {id:"low",     label:"Low Probability", range:"20\u201344%", color:B.red,  desc:"Significant obstacles. Monitor for policy change."},
  {id:"spec",    label:"Speculative",     range:"<20%",        color:B.text4,desc:"Do not promote. Park and re-assess."},
];

const SEVERITY={
  killer:    {label:"Deal Killer", color:B.red,  bg:B.redP,  desc:"Near-impossible to overcome for most uses."},
  serious:   {label:"Serious Risk",color:B.amber,bg:B.amberP,desc:"Significant planning risk. Expert input essential."},
  manageable:{label:"Manageable",  color:B.blue, bg:B.blueP, desc:"Addressable with the right technical studies."},
};

const LPAS_NECA=["Durham County Council","Gateshead Council","Newcastle City Council","North Tyneside Council","Northumberland County Council","South Tyneside Council","Sunderland City Council"];
const LPAS_TVCA=["Middlesbrough Council","Stockton-on-Tees Borough Council","Redcar & Cleveland Borough Council","Darlington Borough Council","Hartlepool Borough Council"];
const MILESTONE_TYPES=["Planning consultant instructed","Pre-application submitted","Call for Sites response","Technical study commissioned","Technical study received","Planning application submitted","Planning permission granted","S106 agreed","Appeal lodged","Appeal decision","Sale heads of terms","Sale completed","Grid connection application","Grid connection offer","Construction started","Practical completion","Landowner meeting","Agreement signed","Developer meeting","Brief matched","Other"];
const COST_CATS=["Planning Consultant","Solicitor / Legal","Technical Study \u2014 Transport","Technical Study \u2014 Ecology","Technical Study \u2014 Flood","Technical Study \u2014 Heritage","Technical Study \u2014 Other","HMLR Title Search","Grid Consultant","Planning Application Fee","Survey","Marketing / Sales","Travel","Construction","Other"];

const MODULES={
  residential:{label:"A \u2014 Policy Pressure",color:"#4ade80",max:6,threshold:4,tests:[
    {id:"A1",label:"HDT score below 95%",tip:"LPA under-delivering against housing need"},
    {id:"A2",label:"5-year land supply shortfall (last 24 months)",tip:"LPA formally acknowledged insufficient housing land"},
    {id:"A3",label:"Local Plan 5+ years old OR review underway",tip:"Ageing plan reduces policy resistance to new allocations"},
    {id:"A4",label:"Call for Sites open/active within 18 months",tip:"LPA actively seeking new sites"},
    {id:"A5",label:"Site in HELAA/SHLAA \u2014 submitted but unallocated",tip:"HIGHEST SIGNAL: passed initial suitability, held back for capacity not fundamental unsuitability"},
    {id:"A6",label:"LPA lost 2+ housing supply appeals (last 3 years)",tip:"Appeal record exposes LPA vulnerability on supply grounds"},
  ]},
  solar_bess:{label:"B \u2014 Grid & Power",color:"#facc15",max:5,threshold:3,tests:[
    {id:"B1",label:"33kV or 132kV substation within 1\u20132km",tip:"Primary viability filter"},
    {id:"B2",label:"DNO connection queue position available",tip:"Grid capacity headroom confirmed"},
    {id:"B3",label:"Agricultural land Grade 3b, 4 or 5 only",tip:"Grade 1/2/3a = near-certain refusal on food security grounds"},
    {id:"B4",label:"South-facing or flat topography",tip:"Yield optimisation"},
    {id:"B5",label:"20+ acres viable (50+ optimal) / BESS 5+ acres",tip:"Min economic scale. BESS under 100MW = standard local planning from Dec 2025"},
  ]},
  data_centre:{label:"C \u2014 Power & Connectivity",color:"#60a5fa",max:5,threshold:4,tests:[
    {id:"C1",label:"Primary substation within 1km (10MW+ available)",tip:"CNI designation Sept 2024 \u2014 planning now strongly supportive"},
    {id:"C2",label:"Dark fibre / carrier-neutral exchange within 2km",tip:"Latency requirements demand connectivity proximity"},
    {id:"C3",label:"Renewable energy co-location viable on/adjacent",tip:"ESG requirements \u2014 operators increasingly demand co-located renewables"},
    {id:"C4",label:"2+ hectares flat ground",tip:"Minimum footprint \u2014 slopes increase build cost significantly"},
    {id:"C5",label:"Water supply within 500m (cooling requirement)",tip:"Significant water demand for cooling systems"},
  ]},
  logistics:{label:"D \u2014 Access & Infrastructure",color:"#f97316",max:5,threshold:3,tests:[
    {id:"D1",label:"Within 1km of motorway junction or A-road",tip:"Strategic road network access"},
    {id:"D2",label:"Rail freight proximity (within 5km)",tip:"Increasingly important for large logistics"},
    {id:"D3",label:"Within or adjacent to allocated employment land",tip:"Existing policy support reduces planning risk"},
    {id:"D4",label:"500k+ population within 30-min HGV drive",tip:"Labour market and distribution catchment"},
    {id:"D5",label:"Three-phase power within 500m",tip:"Industrial power requirement"},
  ]},
  ev_charging:{label:"E \u2014 Traffic & Grid",color:"#a78bfa",max:5,threshold:3,tests:[
    {id:"E1",label:"A-road or motorway junction within 500m",tip:"Traffic flow is the primary revenue driver"},
    {id:"E2",label:"Grid connection viable (500kW\u20132MW required)",tip:"High power demand \u2014 substation proximity critical"},
    {id:"E3",label:"Min 0.5 acres for hardstanding",tip:"Space for bays, canopy, circulation"},
    {id:"E4",label:"Amenity retail / food co-location viable",tip:"Dwell time revenue improves economics"},
    {id:"E5",label:"Logistics corridor for eHGV demand",tip:"Zero-emission HGV mandate driving demand"},
  ]},
  hydrogen:{label:"F \u2014 Energy & Industrial",color:"#34d399",max:5,threshold:3,tests:[
    {id:"F1",label:"Gas pipeline or H2 backbone proximity",tip:"Distribution infrastructure critical"},
    {id:"F2",label:"Industrial cluster or East Coast Cluster alignment",tip:"Cluster co-location de-risks demand"},
    {id:"F3",label:"Grid connection for large MW electrolysis",tip:"Green hydrogen requires significant renewable-sourced power"},
    {id:"F4",label:"Water supply proximity for electrolysis",tip:"Water is the feedstock"},
    {id:"F5",label:"Port or transport access for H2 distribution",tip:"Specialist transport access required"},
  ]},
  bng:{label:"G \u2014 Habitat & Nature",color:"#86efac",max:5,threshold:3,tests:[
    {id:"G1",label:"Low biodiversity baseline (arable/improved grass)",tip:"Low baseline = higher uplift = more units to sell"},
    {id:"G2",label:"Adjacent to Local Nature Recovery Strategy area",tip:"Strategic significance multiplier increases unit value"},
    {id:"G3",label:"Min 5 acres for 30-year legal agreement",tip:"Required for Biodiversity Gain Sites Register"},
    {id:"G4",label:"Woodland creation or wetland restoration viable",tip:"Highest-value habitat types in DEFRA metric"},
    {id:"G5",label:"No existing high-value habitats present",tip:"Existing SSSI/ancient woodland cannot be BNG baseline"},
  ]},
  self_storage:{label:"H \u2014 Location & Access",color:"#fb923c",max:5,threshold:3,tests:[
    {id:"H1",label:"Industrial, trade or retail park location",tip:"B8 context reduces planning objection risk"},
    {id:"H2",label:"Existing B8 consent or clear PD route",tip:"Use class B8 required"},
    {id:"H3",label:"Road frontage / A-road visibility",tip:"Drive-to product \u2014 visibility drives customer acquisition"},
    {id:"H4",label:"5,000+ households within 2km catchment",tip:"Housing density drives occupancy"},
    {id:"H5",label:"Brownfield or redundant employment land",tip:"Strongest planning position"},
  ]},
  office_resi:{label:"I \u2014 Office\u2192Resi (PDR)",color:"#38bdf8",max:6,threshold:4,tests:[
    {id:"I1",label:"Use Class E building",tip:"Class MA PDR \u2014 all Class E, no size/vacancy limit (March 2024)"},
    {id:"I2",label:"No Article 4 Direction removing PDR",tip:"Some LPAs removed Class MA rights \u2014 check"},
    {id:"I3",label:"Not in conservation area requiring ground floor commercial",tip:"Some LPAs restrict ground floor change of use"},
    {id:"I4",label:"Natural light achievable in converted units",tip:"MHCLG prior approval focuses on natural light"},
    {id:"I5",label:"Pre-2012 building / vacancy or lease breaks",tip:"Pre-2012 stock more likely functionally obsolete"},
    {id:"I6",label:"Strong residential demand in catchment",tip:"Comparables support conversion viability"},
  ]},
  hotel:{label:"J \u2014 Hotel Development",color:"#e879f9",max:6,threshold:4,tests:[
    {id:"J1",label:"Tourist, leisure or business destination catchment",tip:"RevPAR benchmarks must support viability"},
    {id:"J2",label:"Town centre or transport hub (walkable amenity)",tip:"Walkable experience-rich locations favoured post-COVID"},
    {id:"J3",label:"Full planning achievable (not Green Belt, not AONB)",tip:"NOT covered by PDR \u2014 full permission required"},
    {id:"J4",label:"No pipeline supply exceeding 15% of existing stock",tip:"Check STR/Glenigan for competing schemes"},
    {id:"J5",label:"30+ room count viable on site",tip:"Sub-30 rooms operationally marginal"},
    {id:"J6",label:"LPA policy supports tourism/hospitality use here",tip:"Check for protective employment land designations"},
  ]},
  pbsa:{label:"K \u2014 Student Accommodation",color:"#fb7185",max:6,threshold:4,tests:[
    {id:"K1",label:"University or HEI within 1km walking",tip:"Sequential test \u2014 campus proximity preferred"},
    {id:"K2",label:"Student bed demand shortfall evidenced",tip:"UK shortfall 450,000+ beds \u2014 verify local supply"},
    {id:"K3",label:"No Article 4 or policy restricting PBSA here",tip:"Some cities have restrictive PBSA sequential policies"},
    {id:"K4",label:"International student intake above 20%",tip:"International students disproportionately prefer PBSA"},
    {id:"K5",label:"Min 50 beds viable on site",tip:"Sub-50 beds operationally marginal"},
    {id:"K6",label:"Renters Rights Act 2025 PBSA exemption criteria met",tip:"Purpose-built/adapted required for fixed-term exemption"},
  ]},
  coliving_btr:{label:"L \u2014 Co-Living / BTR",color:"#fbbf24",max:6,threshold:4,tests:[
    {id:"L1",label:"Strong rental demand \u2014 sub-35 age demographic",tip:"BTR targets young professionals"},
    {id:"L2",label:"PTAL 4+ \u2014 within 400m of rail/metro/bus",tip:"Car-free connectivity drives BTR viability"},
    {id:"L3",label:"BTR policy support in Local Plan or emerging",tip:"Check for affordable private rent requirements"},
    {id:"L4",label:"Brownfield or town centre \u2014 supports intensification",tip:"NPPF 2024 strongly supports urban brownfield"},
    {id:"L5",label:"Market rents above \u00a31,200pcm (1-bed equivalent)",tip:"BTR viability threshold"},
    {id:"L6",label:"Large floorplate or conversion opportunity",tip:"Co-living requires 20%+ communal amenity (GIA)"},
  ]},
  later_living:{label:"M \u2014 Later Living",color:"#6ee7b7",max:6,threshold:4,tests:[
    {id:"M1",label:"Over-65 population above national average",tip:"Aging population concentration drives viability"},
    {id:"M2",label:"Town centre / suburban \u2014 walkable services",tip:"Proximity to GP, retail, community non-negotiable"},
    {id:"M3",label:"Comparable retirement values support viability",tip:"Check McCarthy Stone / Churchill Living comparables"},
    {id:"M4",label:"No restrictive policy preventing C2/C3 use",tip:"Some employment zones resist residential"},
    {id:"M5",label:"Brownfield passport or NPPF priority applicable",tip:"Government brownfield-first policy strongly supportive"},
    {id:"M6",label:"Site unlocks family housing via downsizer chain",tip:"Material planning consideration at appeals"},
  ]},
  dc_cluster:{label:"N \u2014 Data Centre Cluster",color:"#818cf8",max:8,threshold:5,tests:[
    {id:"N1",label:"Within 7km of confirmed hyperscale campus (Cambois/Blyth, Teesworks, Cobalt Park)",tip:"QTS/Blackstone Cambois = under construction 2026. Teesworks = proposed largest in Europe. Cobalt Park = confirmed AI Growth Zone. All within NECA/TVCA."},
    {id:"N2",label:"Within 15km of AI Growth Zone boundary (North East or Teesside designation)",tip:"Government AI Growth Zone = fast-track planning + priority grid access. North East zones confirmed September 2025. Teesworks designation in progress."},
    {id:"N3",label:"Primary substation within 3km being upgraded for data centre load",tip:"Northern Powergrid investing heavily in Blyth/Cambois and Teesworks corridors. Grid upgrades increase available capacity across the surrounding area."},
    {id:"N4",label:"Within 5km of proposed or pipeline data centre (100+ UK projects in planning)",tip:"Use Data Centre Dynamics, Planning Portal, and Glenigan to identify pipeline projects within 5km. A site adjacent to a pipeline scheme captures the cluster effect early."},
    {id:"N5",label:"Employment/industrial land zoning OR clear B2/B8 change of use route",tip:"Data centre cluster uses (logistics, manufacturing, colocation) require B2/B8 or employment land designation. LPA recognition of digital economy uses is growing post-CNI."},
    {id:"N6",label:"Road corridor access for construction HGV / supply chain logistics",tip:"A campus of this scale requires continuous heavy goods movement throughout construction (2026\u20132035) and ongoing operations. A189, A197, A19 and A1 corridors are primary routes."},
    {id:"N7",label:"Site suited to at least one cluster use: logistics / energy / colocation / accommodation / roadside / manufacturing",tip:"Cluster uses ranked by certainty: (1) Logistics/warehousing (2) Energy/BESS (3) Specialist manufacturing (4) Worker accommodation (5) Hotels/roadside (6) Colocation (7) Heat reuse. Site must credibly serve at least one."},
    {id:"N8",label:"No competing data centre on the same parcel or immediately adjacent",tip:"If an operator has already identified the site for their own direct acquisition, Parcel\u2019s promotion route is blocked. Check planning portal and Land Registry for recent data centre-related applications or transfers."},
  ]},
};

const UNI_MODULES={
  constraints:{label:"Universal \u2014 Constraints",color:"#f87171",max:6,threshold:5,note:"Each pass = constraint ABSENT. Killer failures significantly reduce probability.",tests:[
    {id:"U1",label:"Flood Zone 1 only",sev:"killer",tip:"Zone 2/3 = near-automatic fail for residential/BESS. Deal killer."},
    {id:"U2",label:"No SSSI / SPA / SAC on or adjacent",sev:"killer",tip:"Statutory ecological designation = near-impossible to overcome."},
    {id:"U3",label:"Not within AONB or National Park",sev:"serious",tip:"Strong policy weight. Serious risk requiring specialist evidence."},
    {id:"U4",label:"Not within Green Belt (or review underway)",sev:"serious",tip:"VSC test required. Grey belt/CNI evolving \u2014 serious, not absolute."},
    {id:"U5",label:"No Grade I/II* Listed Building within 100m",sev:"manageable",tip:"Heritage impact assessment required \u2014 manageable with specialist."},
    {id:"U6",label:"No TPO coverage over 20%+ of site",sev:"manageable",tip:"Arboricultural survey + replacement planting \u2014 manageable."},
  ]},
  ownership:{label:"Universal \u2014 Ownership",color:"#c084fc",max:4,threshold:3,note:"Applied to all asset classes.",tests:[
    {id:"O1",label:"Single title or max 2 contiguous titles",tip:"Multiple ownership = assembly risk at examination"},
    {id:"O2",label:"No active promotion agent (last 5 years)",tip:"If promoter already active, opportunity is captured"},
    {id:"O3",label:"Owner held title 10+ years (passive holder)",tip:"Long tenure signals landowner unaware of development value"},
    {id:"O4",label:"No option or restriction on title register",tip:"Existing option means someone else has secured the site"},
  ]},
  dc_proximity:{label:"Universal \u2014 Data Centre Proximity",color:"#818cf8",max:4,threshold:2,note:"Applied to ALL sites regardless of asset class. Proximity to data centre infrastructure is a value uplift signal independent of primary use case.",tests:[
    {id:"DC1",label:"Within 15km of confirmed hyperscale campus (Cambois, Teesworks, Cobalt Park)",tip:"CONFIRMED NORTH EAST SITES: QTS/Blackstone Cambois \u2014 720MW, under construction 2026, completing 2035. Teesworks \u2014 proposed largest data centre in Europe, Tees Valley. Cobalt Park \u2014 AI Growth Zone confirmed, North Tyneside. Any site within 15km of these anchors sits in a zone of structural demand uplift."},
    {id:"DC2",label:"Within 15km of pipeline / proposed data centre scheme",tip:"Check: Planning Portal (search \u2018data centre\u2019 within relevant LPA). Data Centre Dynamics UK pipeline tracker. Glenigan. CoStar. JLL/CBRE market reports. The UK has ~100 planned projects \u2014 several in NECA/TVCA beyond the confirmed anchors. A site near a pipeline scheme captures the cluster effect before pricing adjusts."},
    {id:"DC3",label:"Grid infrastructure being upgraded in this corridor for data centre load",tip:"Northern Powergrid is investing specifically in the Blyth/Cambois corridor and Teesworks corridor to serve these campuses. Check NPG\u2019s published network investment programme. A grid upgrade raises available capacity for all users in the corridor \u2014 BESS, solar, EV charging, colocation \u2014 regardless of primary data centre."},
    {id:"DC4",label:"Site is in the 1\u20137km ring (not on the campus itself, not over 15km away)",tip:"THE SWEET SPOT: Sites 0\u20131km are typically already acquired by the operator. Sites over 15km miss the cluster effect. The 1\u20137km ring captures: supply chain logistics demand, worker accommodation, energy co-location, Tier 2 colocation, hotels and roadside. This ring is currently priced as ordinary employment or agricultural land. That repricing happens in the next 18\u201336 months."},
  ]},
};

const PRESET_BRIEFS=[
  {developerName:"Miller Homes",contactName:"Ian Thomson (Land Director, Yorkshire)",email:"land@millerhomes.co.uk",markets:["residential"],tiers:["T1","T2"],minAcres:"8",maxAcres:"25",relationship:true,priority:5,notes:"Personal relationship. Active acquirer \u2014 3+ schemes targeted 2025/26. \u00a3300k\u2013\u00a3600k/acre with planning. Simple ownership, highway access, utilities essential. Target HDT-stressed LPAs. BNG solution required."},
  {developerName:"Duchy Homes",contactName:"",email:"",markets:["residential"],tiers:["T1","T2"],minAcres:"5",maxAcres:"15",relationship:true,priority:5,notes:"Personal relationship. Quality-led North East builder. Village edge and market town sites in NECA/TVCA. Lead with location quality. \u00a3280k\u2013\u00a3500k/acre."},
  {developerName:"McDonald's Restaurants",contactName:"Property Team",email:"",markets:["hospitality","commercial"],tiers:["T1","T2"],minAcres:"1",maxAcres:"2",relationship:true,priority:5,notes:"Personal relationship. Drive-thru: 0.4\u20130.7ha, A-road frontage, 10k+ vehicles/day, visible from road, 40\u201350 parking spaces. Leasehold exit. Land value \u00a3500k\u2013\u00a32M+. Avoid proximity to schools."},
  {developerName:"Greggs",contactName:"Tony Rowson (Property Director)",email:"",markets:["hospitality","commercial"],tiers:["T1","T2"],minAcres:"0.5",maxAcres:"1.5",relationship:true,priority:5,notes:"Personal relationship. 120 net new stores targeted 2026. All North East locations considered. Drive-thru: 1,800sqft, 0.5\u20130.7 acres, roadside visibility, 33 spaces. In-town: 900sqft+ leasehold."},
  {developerName:"Avant Homes",contactName:"Land Director",email:"",markets:["residential"],tiers:["T1","T2"],minAcres:"8",maxAcres:"20",relationship:false,priority:4,notes:"Active in North East, Yorkshire, East Midlands. 60\u2013200 unit sites. \u00a3250k\u2013\u00a3450k/acre."},
  {developerName:"Gleeson Homes",contactName:"Land Team",email:"",markets:["residential"],tiers:["T2","T3"],minAcres:"5",maxAcres:"10",relationship:false,priority:3,notes:"Low-cost land only \u2014 sub-\u00a3150k/acre. Brownfield preferred. North England."},
  {developerName:"Solar / BESS Developer",contactName:"",email:"",markets:["energy"],tiers:["T1","T2"],minAcres:"20",maxAcres:"",relationship:false,priority:5,notes:"33kV+ substation within 1\u20132 miles. DNO capacity confirmed. Grade 3b/4/5 only. Flood Zone 1. BESS under 100MW = local planning (Dec 2025). Exit at consent + grid connection offer."},
  {developerName:"Institutional Energy Fund",contactName:"",email:"",markets:["energy"],tiers:["T1"],minAcres:"12",maxAcres:"",relationship:false,priority:5,notes:"Buy consented BESS/solar with grid connection offers. 25\u201375MW optimal. \u00a31M\u2013\u00a35M+ per site. Gresham House, Gore Street, Downing Renewables."},
  {developerName:"Data Centre Operator",contactName:"",email:"",markets:["digital"],tiers:["T1","T2"],minAcres:"5",maxAcres:"",relationship:false,priority:5,notes:"Primary substation within 1km, 10MW+ capacity. 2\u201310ha for colocation. Fibre within 2km. Water for cooling. CNI Sept 2024 = planning strongly supportive. \u00a31M\u2013\u00a310M+/hectare. Target Teesworks corridor."},
  {developerName:"DC Cluster \u2014 Logistics / Warehousing",contactName:"",email:"",markets:["commercial"],tiers:["T1","T2"],minAcres:"5",maxAcres:"50",relationship:false,priority:5,notes:"Sites in the 1\u20137km ring around Cambois/Blyth QTS campus or Teesworks. B2/B8 employment land. A189, A197, A19, A1 corridor access for HGV. Supply chain demand from 720MW campus under construction 2026\u20132035. Savills tracking 415+ acres of UK land moving from industrial to data centre use \u2014 adjacent industrial land immediately more valuable."},
  {developerName:"DC Cluster \u2014 Worker Accommodation",contactName:"",email:"",markets:["residential","hospitality"],tiers:["T1","T2"],minAcres:"1",maxAcres:"10",relationship:false,priority:4,notes:"1,200 long-term construction jobs at Cambois alone. Temporary modular accommodation villages on agricultural or brownfield land within 10-min drive of campus. Premier Modular, Portakabin, specialist accommodation providers. Also permanent workforce residential demand \u2014 hundreds of technical staff needing homes within 7km of Blyth/Cambois."},
  {developerName:"DC Cluster \u2014 Hotel / Roadside",contactName:"",email:"",markets:["hospitality","commercial"],tiers:["T1","T2"],minAcres:"0.5",maxAcres:"3",relationship:false,priority:4,notes:"A189/A197 corridor north of Newcastle. Budget and mid-market hotels (Premier Inn, Travelodge, Holiday Inn Express). Worker traffic + corporate commissioning engineers + ongoing operational visits. QSR opportunity alongside \u2014 McDonald\u2019s and Greggs both suited to this location type. Blyth/Cramlington/Ashington corridor currently undersupplied."},
  {developerName:"DC Cluster \u2014 Tier 2 Colocation",contactName:"",email:"",markets:["digital"],tiers:["T1","T2"],minAcres:"3",maxAcres:"15",relationship:false,priority:5,notes:"5\u201350MW colocation serving North East economy (financial services, healthcare, universities, local government). Once Cambois grid infrastructure proven, surrounding area viable for smaller operators. CyrusOne, Iron Mountain, NTT Data, Vantage, Kao Data. Sites near Newcastle/Cramlington with B2 zoning, substation access, fibre. Currently no suitable supply \u2014 market served from Manchester or London."},
];

// Probability engine
function calcProb(scores,consultantOverride){
  const W={A1:15,A2:15,A3:12,A4:8,A5:8,A6:8,O1:6,O3:5,O4:5,U1:8,U2:8,U3:5,U4:5};
  const mx=Object.values(W).reduce((a,v)=>a+v,0);
  let obj=Object.entries(W).reduce((a,[id,w])=>a+(scores[id]===1?w:0),0);
  let pct=mx>0?(obj/mx)*100:50;
  if(scores["U1"]===0)pct=Math.max(0,pct-30);
  if(scores["U2"]===0)pct=Math.max(0,pct-30);
  if(scores["U3"]===0)pct=Math.max(0,pct-10);
  if(scores["U4"]===0)pct=Math.max(0,pct-10);
  if(scores["A5"]===1)pct=Math.min(100,pct+8);
  // Data centre proximity bonus — structural demand uplift independent of policy
  const dcScore=(scores["DC1"]===1?1:0)+(scores["DC2"]===1?1:0)+(scores["DC3"]===1?1:0)+(scores["DC4"]===1?1:0);
  if(dcScore>=3)pct=Math.min(100,pct+12); // In the sweet spot with grid uplift
  else if(dcScore>=2)pct=Math.min(100,pct+6);
  else if(dcScore>=1)pct=Math.min(100,pct+3);
  const ov=parseFloat(consultantOverride)||0;
  const final=Math.round(Math.max(0,Math.min(100,pct+(ov*0.3))));
  const band=final>=70?PROB_BANDS[0]:final>=45?PROB_BANDS[1]:final>=20?PROB_BANDS[2]:PROB_BANDS[3];
  const pos=[],neg=[];
  if(scores["A1"]===1)pos.push("HDT below 95%");
  if(scores["A2"]===1)pos.push("5-year supply shortfall");
  if(scores["A3"]===1)pos.push("Local Plan aged/under review");
  if(scores["A5"]===1)pos.push("In HELAA \u2014 unallocated (strongest signal)");
  if(scores["A6"]===1)pos.push("LPA lost housing appeals");
  if(scores["DC1"]===1)pos.push("Within 15km of confirmed hyperscale campus");
  if(scores["DC2"]===1)pos.push("Within 15km of pipeline data centre scheme");
  if(scores["DC3"]===1)pos.push("Grid corridor being upgraded for data centre load");
  if(scores["DC4"]===1)pos.push("In the 1\u20137km value ring around anchor campus");
  if(scores["U1"]===0)neg.push("Flood risk \u2014 Zone 2/3 (deal killer)");
  if(scores["U2"]===0)neg.push("Statutory ecology \u2014 SSSI/SPA/SAC (deal killer)");
  if(scores["U3"]===0)neg.push("AONB/National Park (serious risk)");
  if(scores["U4"]===0)neg.push("Green Belt (serious risk)");
  if(scores["O4"]===0)neg.push("Existing option/restriction on title");
  if(scores["A1"]===0&&scores["A2"]===0)neg.push("No clear LPA housing pressure");
  return{final,obj:Math.round(pct),band,pos,neg};
}

function computeResults(scores,selectedAssets,consultantOverride){
  const mods={...UNI_MODULES};
  (selectedAssets||[]).forEach(a=>{if(MODULES[a])mods[a]=MODULES[a];});
  let tot=0,max=0,fails=0;
  const mr={};
  Object.entries(mods).forEach(([k,m])=>{
    const sc=m.tests.reduce((a,t)=>a+(scores[t.id]===1?1:0),0);
    const passed=sc>=m.threshold;
    if(!passed)fails++;
    tot+=sc;max+=m.max;
    mr[k]={score:sc,max:m.max,threshold:m.threshold,passed,mod:m};
  });
  const pct=max>0?tot/max:0;
  const tier=fails>0?TIERS[3]:pct>=0.82?TIERS[0]:pct>=0.67?TIERS[1]:pct>=0.5?TIERS[2]:TIERS[3];
  const prob=calcProb(scores,consultantOverride||"0");
  const constIssues=(mods.constraints?.tests||[]).filter(t=>scores[t.id]===0&&t.sev).map(t=>({...t,...SEVERITY[t.sev]}));
  return{tot,max,pct,tier,fails,mr,prob,constIssues};
}

// Storage — in-session state only
function load(){return{sites:[],dealMakers:[],briefs:[],nextId:1,currentUser:{id:"admin_1",role:"admin",name:"Parcel Admin"}};}

// Utils
const uid=()=>`${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
const fmtD=d=>{if(!d)return"\u2014";const dt=new Date(d);return isNaN(dt)?d:dt.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});};
const fmtC=n=>{if(!n&&n!==0)return"\u2014";const v=parseFloat(n);return isNaN(v)?"\u2014":"\u00a3"+v.toLocaleString("en-GB",{maximumFractionDigits:0});};
const totalCosts=s=>(s.costs||[]).reduce((a,c)=>a+(parseFloat(c.amount)||0),0);
const overdueMs=s=>(s.milestones||[]).filter(m=>!m.done&&m.due&&new Date(m.due)<new Date()).length;
const getMkt=id=>MARKETS.find(m=>m.id===id)||MARKETS[0];
const getTier=id=>TIERS.find(t=>t.id===id)||TIERS[TIERS.length-1];
const getSt=id=>SITE_STATUSES.find(s=>s.id===id)||SITE_STATUSES[0];
const hexRgb=h=>{const r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);return r?`${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}`:"255,255,255";};

function matchBrief(brief,site){
  let sc=0,mx=0;
  mx+=3;if(brief.markets.length===0||brief.markets.includes(site.primaryMarket)||(site.secondaryMarkets||[]).some(m=>brief.markets.includes(m)))sc+=3;
  mx+=2;if(brief.tiers.includes(site.tier))sc+=2;
  mx+=1;if(!brief.minAcres||parseFloat(site.area||0)>=parseFloat(brief.minAcres))sc+=1;
  mx+=1;if(!brief.maxAcres||parseFloat(site.area||0)<=parseFloat(brief.maxAcres))sc+=1;
  return mx>0?Math.round((sc/mx)*100):0;
}

function blankSite(n){return{id:uid(),ref:`PCI-${String(n).padStart(3,"0")}`,name:"",stream:"S1",primaryMarket:"residential",secondaryMarkets:[],lpa:"",area:"",currentUse:"",gridRef:"",status:"scored",tier:"--",probability:null,score:null,selectedAssets:[],scores:{},consultantOverride:"0",consultantNote:"",consultantName:"",ownerName:"",titleNumber:"",ownerType:"",tenure:"",ownerSince:"",ownerContact:"",ownerSolicitor:"",ownerApproached:false,approachDate:"",agreementSigned:false,agreementDate:"",restrictionRegistered:false,floorPrice:"",exclusivityEnd:"",planningConsultant:"",solicitor:"",notes:"",ownerNotes:"",createdAt:new Date().toISOString().slice(0,10),milestones:[],costs:[],claimedBy:null,claimedAt:null,promotedInterest:"25",commissionRate:"10",scoreHistory:[]};}
function blankBrief(){return{id:uid(),dealMakerId:null,developerName:"",contactName:"",email:"",phone:"",relationship:false,priority:3,markets:[],minAcres:"",maxAcres:"",tiers:["T1","T2"],notes:"",createdAt:new Date().toISOString().slice(0,10),active:true};}
function blankDM(){return{id:uid(),name:"",email:"",phone:"",company:"",markets:[],active:true,joinedAt:new Date().toISOString().slice(0,10),notes:""};}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S={
  app:{display:"flex",minHeight:"100vh",background:B.navy,color:B.paper,fontFamily:"'DM Mono','Courier New',monospace",fontSize:"12px",lineHeight:"1.6"},
  sb:{width:"220px",background:B.navy2,display:"flex",flexDirection:"column",minHeight:"100vh",flexShrink:0,borderRight:`1px solid ${B.ruleN}`},
  sbTop:{padding:"20px 18px 16px",borderBottom:`1px solid ${B.ruleN}`},
  sbMark:{fontFamily:"Georgia,serif",fontSize:"20px",color:B.paper,letterSpacing:"-0.01em",lineHeight:1},
  sbDot:{color:B.gold},
  sbSub:{fontSize:"8px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(245,241,234,0.28)",marginTop:"3px"},
  sbSecLbl:{fontSize:"8px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(245,241,234,0.2)",padding:"14px 18px 5px",fontWeight:500},
  sbItem:a=>({display:"flex",alignItems:"center",gap:"9px",padding:"8px 18px",cursor:"pointer",fontSize:"11px",color:a?"rgba(245,241,234,0.9)":"rgba(245,241,234,0.4)",background:a?"rgba(201,166,107,0.1)":"transparent",borderLeft:`2px solid ${a?B.gold:"transparent"}`,transition:"all 0.12s",border:"none",width:"100%",textAlign:"left",fontFamily:"'DM Mono',monospace",letterSpacing:"0.02em"}),
  main:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"},
  topbar:{background:B.navy2,borderBottom:`1px solid ${B.ruleN}`,padding:"0 28px",height:"52px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0},
  topTitle:{fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:B.paper,fontWeight:500},
  content:{flex:1,padding:"24px 28px",overflowY:"auto"},
  card:{background:B.navy2,border:`1px solid ${B.ruleN}`,padding:"18px 20px",marginBottom:"10px"},
  cardT:{fontSize:"8px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(245,241,234,0.3)",marginBottom:"12px",fontWeight:500},
  lbl:{fontSize:"8px",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(245,241,234,0.3)",fontWeight:500,display:"block",marginBottom:"4px"},
  inp:{width:"100%",background:"rgba(245,241,234,0.06)",border:"1px solid rgba(245,241,234,0.1)",padding:"8px 10px",fontSize:"11.5px",color:B.paper,fontFamily:"'DM Mono',monospace",outline:"none",boxSizing:"border-box"},
  sel:{width:"100%",background:"rgba(245,241,234,0.06)",border:"1px solid rgba(245,241,234,0.1)",padding:"8px 10px",fontSize:"11.5px",color:B.paper,fontFamily:"'DM Mono',monospace",outline:"none",boxSizing:"border-box",appearance:"none"},
  ta:{width:"100%",background:"rgba(245,241,234,0.06)",border:"1px solid rgba(245,241,234,0.1)",padding:"8px 10px",fontSize:"11.5px",color:B.paper,fontFamily:"'DM Mono',monospace",outline:"none",resize:"vertical",minHeight:"70px",boxSizing:"border-box"},
  r2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"},
  r3:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"10px"},
  btnG:{background:B.gold,color:B.navy,border:"none",padding:"8px 16px",fontSize:"9px",letterSpacing:"0.14em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:500},
  btnN:{background:"rgba(245,241,234,0.08)",color:B.paper,border:`1px solid ${B.ruleN}`,padding:"8px 16px",fontSize:"9px",letterSpacing:"0.14em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:500},
  btnO:{background:"transparent",color:"rgba(245,241,234,0.4)",border:"1px solid rgba(245,241,234,0.12)",padding:"7px 13px",fontSize:"9px",letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'DM Mono',monospace"},
  btnD:{background:"transparent",color:B.red,border:`1px solid rgba(185,28,28,0.25)`,padding:"6px 11px",fontSize:"9px",letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'DM Mono',monospace"},
  tbl:{width:"100%",borderCollapse:"collapse"},
  th:{background:B.navy,color:"rgba(245,241,234,0.4)",fontSize:"8px",letterSpacing:"0.16em",textTransform:"uppercase",padding:"9px 13px",textAlign:"left",fontWeight:500,whiteSpace:"nowrap"},
  td:{padding:"10px 13px",borderBottom:`1px solid ${B.ruleN}`,fontSize:"11px",color:"rgba(245,241,234,0.7)",fontWeight:300,verticalAlign:"top"},
  badge:c=>({display:"inline-block",fontSize:"8px",letterSpacing:"0.1em",textTransform:"uppercase",padding:"2px 7px",background:`${c}18`,color:c,fontWeight:500,whiteSpace:"nowrap"}),
  stat:c=>({background:B.navy2,border:`1px solid ${B.ruleN}`,borderTop:`3px solid ${c}`,padding:"16px 18px"}),
  statN:{fontFamily:"Georgia,serif",fontSize:"28px",color:B.paper,lineHeight:1,marginBottom:"3px"},
  statL:{fontSize:"8px",letterSpacing:"0.14em",textTransform:"uppercase",color:"rgba(245,241,234,0.35)",lineHeight:1.5},
  overlay:{position:"fixed",inset:0,background:"rgba(13,27,42,0.65)",zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"flex-end"},
  drawer:{background:B.navy2,width:"min(740px,100vw)",height:"100vh",overflowY:"auto",display:"flex",flexDirection:"column",boxShadow:"-6px 0 32px rgba(0,0,0,0.3)"},
  dHead:{background:B.navy,padding:"18px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,position:"sticky",top:0,zIndex:10,borderBottom:`1px solid ${B.ruleN}`},
  dBody:{flex:1,padding:"22px",overflowY:"auto"},
  dSecT:{fontSize:"8px",letterSpacing:"0.22em",textTransform:"uppercase",color:B.gold2,fontWeight:500,marginBottom:"12px",paddingBottom:"7px",borderBottom:`1px solid ${B.ruleN}`},
  divider:{borderTop:`1px solid ${B.ruleN}`,margin:"16px 0"},
};

const Fld=({label,children,span})=><div style={span?{gridColumn:`span ${span}`}:{}}><label style={S.lbl}>{label}</label>{children}</div>;
const Div=()=><div style={S.divider}/>;
const MktBadge=({id})=>{const m=getMkt(id);return<span style={S.badge(m.color)}>{m.icon} {m.label}</span>;};
const TierBadge=({id})=>{const t=getTier(id);return<span style={S.badge(t.color)}>{t.label}</span>;};
const StBadge=({id})=>{const s=getSt(id);return<span style={S.badge(s.color)}>{s.label}</span>;};
const ProbBadge=({pct})=>{const b=pct>=70?PROB_BANDS[0]:pct>=45?PROB_BANDS[1]:pct>=20?PROB_BANDS[2]:PROB_BANDS[3];return<span style={S.badge(b.color)}>{b.label} {pct}%</span>;};

function MultiSel({options,value,onChange,label}){
  return<div><label style={S.lbl}>{label}</label><div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{options.map(o=>{const sel=value.includes(o.id||o);return<button key={o.id||o} onClick={()=>onChange(sel?value.filter(v=>v!==(o.id||o)):[...value,o.id||o])} style={{padding:"3px 9px",fontSize:"9px",letterSpacing:"0.08em",border:`1px solid ${sel?(o.color||B.gold2):B.ruleN}`,background:sel?`${(o.color||B.gold2)}18`:"transparent",color:sel?(o.color||B.gold2):"rgba(245,241,234,0.35)",cursor:"pointer",fontFamily:"'DM Mono',monospace",transition:"all 0.12s"}}>{o.icon?`${o.icon} `:""}{o.label||o}</button>;})}</div></div>;
}

// ─── SCORING WIZARD ───────────────────────────────────────────────────────────
function ScoringWizard({site,onComplete,onCancel}){
  const[selAssets,setSelAssets]=useState(site.selectedAssets||[]);
  const[scores,setScores]=useState(site.scores||{});
  const[activeM,setActiveM]=useState(null);
  const[override,setOverride]=useState(site.consultantOverride||"0");
  const[cNote,setCNote]=useState(site.consultantNote||"");
  const[cName,setCName]=useState(site.consultantName||"");
  const[wStep,setWStep]=useState(selAssets.length>0?2:1);

  const getMods=()=>{const m={...UNI_MODULES};selAssets.forEach(a=>{if(MODULES[a])m[a]=MODULES[a];});return m;};
  const allMods=getMods();const modKeys=Object.keys(allMods);
  const allTests=Object.values(allMods).flatMap(m=>m.tests||[]);
  const answered=allTests.filter(t=>scores[t.id]!==undefined).length;
  const prog=allTests.length>0?(answered/allTests.length)*100:0;
  const liveProb=answered>5?calcProb(scores,override):null;

  const finish=()=>{
    const res=computeResults(scores,selAssets,override);
    const now=new Date().toLocaleDateString("en-GB");
    const histEntry={date:now,prob:res.prob.final,tier:res.tier.label,score:`${res.tot}/${res.max}`};
    onComplete({selectedAssets:selAssets,scores,consultantOverride:override,consultantNote:cNote,consultantName:cName,tier:res.tier.id,probability:res.prob.final,score:`${res.tot}/${res.max}`,scoreHistory:[histEntry,...(site.scoreHistory||[]).slice(0,9)]});
  };

  function renderModule(mk) {
    const m = allMods[mk];
    if (!m) return null;
    return (
      <div>
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}>
            <span style={{fontSize:"10px",color:m.color||B.gold,fontWeight:500}}>{m.label}</span>
            <span style={{fontSize:"9px",color:"rgba(245,241,234,0.25)"}}>Min {m.threshold}/{m.max}</span>
          </div>
          {m.note&&<div style={{fontSize:"9px",color:"rgba(245,241,234,0.25)",marginBottom:"10px"}}>{m.note}</div>}
          {m.tests.map(test => {
            const val = scores[test.id];
            const sev = test.sev ? SEVERITY[test.sev] : null;
            return (
              <div key={test.id}>
                <div style={{display:"flex",alignItems:"flex-start",gap:"10px",padding:"9px 0",borderBottom:`1px solid ${B.ruleN}`}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"11.5px",color:"rgba(245,241,234,0.8)",lineHeight:1.5,display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap"}}>
                      {test.label}
                      {sev&&<span style={{fontSize:"7px",letterSpacing:"0.1em",textTransform:"uppercase",padding:"1px 5px",background:`${sev.color}18`,color:sev.color,fontWeight:500}}>{sev.label}</span>}
                    </div>
                    <div style={{fontSize:"9px",color:"rgba(245,241,234,0.28)",marginTop:"2px"}}>{test.tip}</div>
                  </div>
                  <div style={{display:"flex",gap:"5px",flexShrink:0}}>
                    {[{t:"pass",i:"✓",c:B.green},{t:"fail",i:"✗",c:B.red}].map(({t,i,c}) => (
                      <button key={t} onClick={()=>setScores(p=>({...p,[test.id]:t==="pass"?1:0}))}
                        style={{width:"32px",height:"26px",border:`1px solid ${(t==="pass"?val===1:val===0)?c:B.ruleN}`,background:(t==="pass"?val===1:val===0)?`${c}20`:"rgba(245,241,234,0.03)",color:(t==="pass"?val===1:val===0)?c:"rgba(245,241,234,0.25)",fontSize:"13px",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>
                        {i}
                      </button>
                    ))}
                  </div>
                </div>
                {val===0&&sev&&<div style={{padding:"7px 10px",background:sev.bg,borderBottom:`1px solid ${sev.color}25`,fontSize:"10px",color:sev.color,lineHeight:1.6}}><strong>{sev.label}:</strong> {sev.desc}</div>}
              </div>
            );
          })}
        </div>
        {liveProb&&(
          <div style={{...S.card,display:"flex",justifyContent:"space-between",alignItems:"center",borderColor:`${liveProb.band.color}30`}}>
            <span style={{fontSize:"9px",color:"rgba(245,241,234,0.35)"}}>Live estimate</span>
            <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
              <span style={S.badge(liveProb.band.color)}>{liveProb.band.label}</span>
              <span style={{fontFamily:"Georgia,serif",fontSize:"22px",color:liveProb.band.color}}>{liveProb.final}%</span>
            </div>
          </div>
        )}
        {modKeys.indexOf(mk)===modKeys.length-1&&(
          <div style={S.card}>
            <div style={S.dSecT}>Planning Consultant Override (optional)</div>
            <div style={S.r2}>
              <div>
                <label style={S.lbl}>Adjustment (−15 to +15)</label>
                <input style={S.inp} type="range" min="-15" max="15" step="1" value={override} onChange={e=>setOverride(e.target.value)}/>
                <div style={{fontSize:"10px",color:parseFloat(override)>=0?B.green:B.red,marginTop:"4px",textAlign:"center"}}>{parseFloat(override)>0?"+":""}{override} pts</div>
              </div>
              <Fld label="Consultant Name"><input style={S.inp} value={cName} onChange={e=>setCName(e.target.value)} placeholder="e.g. Jane Smith, Pegasus"/></Fld>
            </div>
            <Fld label="Reasoning"><textarea style={S.ta} value={cNote} onChange={e=>setCNote(e.target.value)} placeholder="Local knowledge, LPA context, inspector track record..."/></Fld>
          </div>
        )}
        <div style={{display:"flex",gap:"8px",marginTop:"6px"}}>
          {modKeys.indexOf(mk)>0
            ? <button style={S.btnO} onClick={()=>setActiveM(modKeys[modKeys.indexOf(mk)-1])}>&#8592; Prev</button>
            : <button style={S.btnO} onClick={()=>setWStep(1)}>&#8592; Assets</button>
          }
          {modKeys.indexOf(mk)<modKeys.length-1
            ? <button style={{...S.btnG,flex:1}} onClick={()=>setActiveM(modKeys[modKeys.indexOf(mk)+1])}>Next Module &#8594;</button>
            : <button style={{...S.btnG,flex:1}} onClick={finish}>Save Score &#8594;</button>
          }
        </div>
      </div>
    );
  }

  if(wStep===1) return<div>
    <div style={S.dSecT}>Select Asset Classes</div>
    <p style={{fontSize:"11px",color:"rgba(245,241,234,0.4)",marginBottom:"14px"}}>Select all that apply — the tool scores simultaneously across every class.</p>
    {["Strategic","Urban"].map(grp=><div key={grp}>
      <div style={{fontSize:"8px",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(245,241,234,0.2)",marginBottom:"6px",marginTop:grp==="Urban"?"12px":"0"}}>{grp}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",marginBottom:"4px"}}>
        {ASSET_CLASSES.filter(a=>a.group===grp).map(ac=>{const sel=selAssets.includes(ac.id);return<button key={ac.id} onClick={()=>setSelAssets(p=>sel?p.filter(x=>x!==ac.id):[...p,ac.id])} style={{background:sel?`rgba(${hexRgb(ac.color)},0.12)`:"rgba(245,241,234,0.03)",border:`1px solid ${sel?ac.color:B.ruleN}`,padding:"9px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",color:sel?ac.color:"rgba(245,241,234,0.4)",fontFamily:"'DM Mono',monospace",fontSize:"11px"}}><span style={{fontSize:"15px"}}>{ac.icon}</span><span>{ac.label}</span></button>;})}
      </div>
    </div>)}
    <div style={{display:"flex",gap:"8px",marginTop:"14px"}}><button style={S.btnO} onClick={onCancel}>Cancel</button><button style={{...S.btnG,flex:1,opacity:selAssets.length===0?0.4:1}} onClick={()=>selAssets.length>0&&setWStep(2)}>Score Criteria ({selAssets.length} selected) →</button></div>
  </div>;

  if(wStep===2&&modKeys.length>0) return<div>
    <div style={{height:"2px",background:B.ruleN,marginBottom:"12px"}}><div style={{height:"100%",background:`linear-gradient(90deg,${B.gold},#60a5fa)`,width:`${prog}%`,transition:"width 0.3s"}}/></div>
    <div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"12px"}}>
      {modKeys.map(k=>{const m=allMods[k];const sc=m.tests.reduce((a,t)=>a+(scores[t.id]===1?1:0),0);const done=m.tests.every(t=>scores[t.id]!==undefined);const pass=sc>=m.threshold;
        return<button key={k} onClick={()=>setActiveM(k)} style={{padding:"4px 10px",fontSize:"8px",letterSpacing:"0.06em",border:`1px solid ${activeM===k?(m.color||B.gold):B.ruleN}`,background:activeM===k?`rgba(${hexRgb(m.color||"#ffffff")},0.1)`:"transparent",color:activeM===k?(m.color||B.gold):"rgba(245,241,234,0.35)",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>
          {done?(pass?"\u2713 ":"\u2717 "):""}{(m.label||"").split("\u2014")[1]?.trim()||(m.label||"")}
        </button>;})}
    </div>
    {(activeM||modKeys[0])&&renderModule(activeM||modKeys[0])}
  </div>;
  return null;
}

// ─── SITE DRAWER ──────────────────────────────────────────────────────────────
function SiteDrawer({site,dealMakers,currentUser,briefs,onSave,onDelete,onClaim,onUnclaim,onClose}){
  const[s,setS]=useState(()=>JSON.parse(JSON.stringify(site)));
  const[tab,setTab]=useState(!site.tier||site.tier==="--"?"score":"details");
  const isAdmin=currentUser.role==="admin";
  const myDm=!isAdmin?dealMakers.find(d=>d.id===currentUser.id):null;
  const canEdit=isAdmin||(myDm&&s.claimedBy===myDm.id);
  const dm=dealMakers.find(d=>d.id===s.claimedBy);
  const uv=f=>e=>setS(p=>({...p,[f]:e.target.value}));
  const ub=f=>v=>setS(p=>({...p,[f]:v}));
  const res=s.selectedAssets?.length>0?computeResults(s.scores||{},s.selectedAssets,s.consultantOverride||"0"):null;
  const comm={pi:parseFloat(s.promotedInterest)||25,cr:parseFloat(s.commissionRate)||10};
  comm.dm=+(comm.pi*(comm.cr/100)).toFixed(1);comm.parcel=+(comm.pi-comm.dm).toFixed(1);
  const addMs=()=>setS(p=>({...p,milestones:[...(p.milestones||[]),{id:uid(),type:"",date:"",due:"",done:false,note:""}]}));
  const upMs=(id,f,v)=>setS(p=>({...p,milestones:p.milestones.map(m=>m.id===id?{...m,[f]:v}:m)}));
  const delMs=id=>setS(p=>({...p,milestones:p.milestones.filter(m=>m.id!==id)}));
  const addC=()=>setS(p=>({...p,costs:[...(p.costs||[]),{id:uid(),category:"",description:"",amount:"",date:"",recoverable:true,paid:false}]}));
  const upC=(id,f,v)=>setS(p=>({...p,costs:p.costs.map(c=>c.id===id?{...c,[f]:v}:c)}));
  const delC=id=>setS(p=>({...p,costs:p.costs.filter(c=>c.id!==id)}));
  const totC=totalCosts(s);const recC=(s.costs||[]).filter(c=>c.recoverable).reduce((a,c)=>a+(parseFloat(c.amount)||0),0);
  const matchedBriefs=briefs.filter(b=>b.active&&matchBrief(b,s)>=60).sort((a,z)=>matchBrief(z,s)-matchBrief(a,s));
  const tabs=[{id:"details",label:"Site"},{id:"score",label:`Score${res?` \u2014 ${s.probability||"?"}%`:""}`},{id:"owner",label:"Landowner"},{id:"milestones",label:`Milestones (${(s.milestones||[]).length})`},{id:"costs",label:`Costs (${fmtC(totC)})`},{id:"briefs",label:`Briefs (${matchedBriefs.length})`},{id:"commission",label:"Commission"},...(canEdit?[{id:"notes",label:"Notes"}]:[])];

  return<div style={S.overlay} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={S.drawer}>
      <div style={S.dHead}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <span style={{fontFamily:"Georgia,serif",fontSize:"17px",color:B.paper}}>{s.ref}</span>
            {s.tier!=="--"&&<TierBadge id={s.tier}/>}
            {s.probability!=null&&<ProbBadge pct={s.probability}/>}
            <StBadge id={s.status}/>
          </div>
          <div style={{fontSize:"10px",color:"rgba(245,241,234,0.35)",marginTop:"2px"}}>{s.name||"Unnamed"}{dm?` \u00b7 ${dm.name}`:""}</div>
        </div>
        <div style={{display:"flex",gap:"6px"}}>
          {canEdit&&<button style={S.btnG} onClick={()=>onSave(s)}>Save</button>}
          {!isAdmin&&!canEdit&&(s.status==="available"||s.status==="scored")&&<button style={S.btnG} onClick={()=>{onClaim(s.id);onClose();}}>Claim Site</button>}
          {isAdmin&&s.claimedBy&&<button style={S.btnD} onClick={()=>{onUnclaim(s.id);}}>Unclaim</button>}
          <button style={{...S.btnO,color:"rgba(245,241,234,0.35)"}} onClick={onClose}>\u2715</button>
        </div>
      </div>
      {isAdmin&&<div style={{background:B.navy,padding:"9px 22px",display:"flex",gap:"12px",borderBottom:`1px solid ${B.ruleN}`,flexShrink:0}}>
        <div><label style={S.lbl}>Status</label><select style={{...S.sel,width:"190px"}} value={s.status} onChange={uv("status")}>{SITE_STATUSES.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}</select></div>
        <div><label style={S.lbl}>Assign Deal Maker</label><select style={{...S.sel,width:"180px"}} value={s.claimedBy||""} onChange={e=>setS(p=>({...p,claimedBy:e.target.value||null,status:e.target.value?p.status==="scored"?"claimed":p.status:"available"}))}><option value="">Unassigned</option>{dealMakers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
      </div>}
      <div style={{display:"flex",borderBottom:`1px solid ${B.ruleN}`,background:B.navy,flexShrink:0,overflowX:"auto"}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"9px 14px",border:"none",background:"transparent",cursor:"pointer",fontSize:"9px",letterSpacing:"0.06em",color:tab===t.id?B.gold:"rgba(245,241,234,0.4)",borderBottom:`2px solid ${tab===t.id?B.gold:"transparent"}`,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap",fontWeight:tab===t.id?500:300}}>{t.label}</button>)}
      </div>
      <div style={S.dBody}>
        {tab==="details"&&<div>
          <div style={S.dSecT}>Site Information</div>
          <div style={S.r2}><Fld label="Site Name"><input style={S.inp} disabled={!canEdit} value={s.name} onChange={uv("name")} placeholder="e.g. Land south of Yarm Road"/></Fld><Fld label="Reference"><input style={S.inp} disabled={!isAdmin} value={s.ref} onChange={uv("ref")}/></Fld></div>
          <div style={S.r3}><Fld label="Stream"><select style={S.sel} disabled={!isAdmin} value={s.stream} onChange={uv("stream")}><option value="S1">Promotion</option><option value="S2">Development</option></select></Fld><Fld label="Primary Market"><select style={S.sel} disabled={!isAdmin} value={s.primaryMarket} onChange={uv("primaryMarket")}>{MARKETS.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}</select></Fld><Fld label="Area (acres)"><input style={S.inp} disabled={!canEdit} type="number" value={s.area} onChange={uv("area")}/></Fld></div>
          <div style={{marginBottom:"10px"}}><MultiSel label="Secondary Markets" options={MARKETS.filter(m=>m.id!==s.primaryMarket)} value={s.secondaryMarkets||[]} onChange={v=>setS(p=>({...p,secondaryMarkets:v}))}/></div>
          <div style={S.r2}><Fld label="LPA"><select style={S.sel} disabled={!isAdmin} value={s.lpa} onChange={uv("lpa")}><option value="">Select...</option><optgroup label="NECA">{LPAS_NECA.map(l=><option key={l}>{l}</option>)}</optgroup><optgroup label="TVCA">{LPAS_TVCA.map(l=><option key={l}>{l}</option>)}</optgroup><option>Other</option></select></Fld><Fld label="Current Use"><input style={S.inp} disabled={!isAdmin} value={s.currentUse} onChange={uv("currentUse")}/></Fld></div>
          <div style={S.r2}><Fld label="Planning Consultant"><input style={S.inp} disabled={!canEdit} value={s.planningConsultant} onChange={uv("planningConsultant")}/></Fld><Fld label="Solicitor"><input style={S.inp} disabled={!canEdit} value={s.solicitor||""} onChange={uv("solicitor")}/></Fld></div>
        </div>}

        {tab==="score"&&<div>
          {res&&<div style={{background:B.navy,border:`1px solid ${res.prob.band.color}30`,borderLeft:`4px solid ${res.prob.band.color}`,padding:"16px 20px",marginBottom:"14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:"8px",letterSpacing:"0.2em",textTransform:"uppercase",color:res.prob.band.color,fontWeight:500,marginBottom:"5px"}}>Planning Probability</div>
                <div style={{fontFamily:"Georgia,serif",fontSize:"44px",color:res.prob.band.color,lineHeight:0.9,marginBottom:"6px"}}>{res.prob.final}<span style={{fontSize:"22px",opacity:0.6}}>%</span></div>
                <div style={{fontSize:"11px",color:B.paper}}>{res.prob.band.label} \u00b7 {res.prob.band.range}</div>
                <div style={{fontSize:"10px",color:"rgba(245,241,234,0.4)",marginTop:"3px"}}>{res.prob.band.desc}</div>
              </div>
              <div style={{textAlign:"right"}}><TierBadge id={res.tier.id}/><div style={{fontFamily:"Georgia,serif",fontSize:"22px",color:res.tier.color,marginTop:"5px"}}>{res.tot}/{res.max}</div>{res.fails>0&&<div style={{fontSize:"9px",color:B.red,marginTop:"3px"}}>{res.fails} gate{res.fails!==1?"s":""} failed</div>}</div>
            </div>
            {(res.prob.pos.length>0||res.prob.neg.length>0)&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginTop:"12px",paddingTop:"12px",borderTop:"1px solid rgba(245,241,234,0.07)"}}>
              {res.prob.pos.length>0&&<div>{res.prob.pos.map((p,i)=><div key={i} style={{fontSize:"9px",color:"rgba(245,241,234,0.5)",padding:"2px 0",display:"flex",gap:"6px"}}><span style={{color:B.green}}>+</span>{p}</div>)}</div>}
              {res.prob.neg.length>0&&<div>{res.prob.neg.map((n,i)=><div key={i} style={{fontSize:"9px",color:"rgba(245,241,234,0.5)",padding:"2px 0",display:"flex",gap:"6px"}}><span style={{color:B.red}}>\u2014</span>{n}</div>)}</div>}
            </div>}
            {res.constIssues.length>0&&<div style={{marginTop:"12px"}}>{res.constIssues.map((ci,i)=><div key={i} style={{padding:"7px 10px",background:ci.bg,border:`1px solid ${ci.color}25`,marginBottom:"5px",fontSize:"10px",color:ci.color}}><strong>{ci.label}:</strong> {ci.desc}</div>)}</div>}
            <div style={{marginTop:"12px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px"}}>
              {Object.entries(res.mr).map(([k,mr])=><div key={k} style={{padding:"5px 8px",background:mr.passed?"rgba(46,125,50,0.08)":"rgba(185,28,28,0.07)",border:`1px solid ${mr.passed?"rgba(46,125,50,0.15)":"rgba(185,28,28,0.18)"}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:"9px",color:"rgba(245,241,234,0.5)"}}>{mr.mod.label.split("\u2014")[1]?.trim()||mr.mod.label}</span>
                <span style={{fontSize:"10px",color:mr.passed?B.green:B.red,fontWeight:500}}>{mr.score}/{mr.max}</span>
              </div>)}
            </div>
            {(s.scoreHistory||[]).length>1&&<div style={{marginTop:"10px",paddingTop:"10px",borderTop:"1px solid rgba(245,241,234,0.07)"}}>
              <div style={{fontSize:"8px",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(245,241,234,0.25)",marginBottom:"6px"}}>Score History</div>
              {(s.scoreHistory||[]).map((h,i)=><div key={i} style={{fontSize:"9px",color:"rgba(245,241,234,0.4)",display:"flex",gap:"12px",padding:"3px 0"}}><span style={{minWidth:"80px"}}>{h.date}</span><span style={{color:h.prob>=70?B.green:h.prob>=45?B.amber:B.red}}>{h.prob}%</span><span>{h.tier}</span><span style={{color:"rgba(245,241,234,0.3)"}}>{h.score}</span></div>)}
            </div>}
          </div>}
          {canEdit&&<div><div style={S.dSecT}>{res?"Re-Score This Site":"Score This Site"}</div><ScoringWizard site={s} onComplete={data=>setS(p=>({...p,...data}))} onCancel={()=>setTab("details")}/></div>}
        </div>}

        {tab==="owner"&&<div>
          <div style={S.dSecT}>Landowner Details</div>
          <div style={S.r2}><Fld label="Owner Name"><input style={S.inp} disabled={!canEdit} value={s.ownerName} onChange={uv("ownerName")}/></Fld><Fld label="Title Number (HMLR)"><input style={S.inp} disabled={!canEdit} value={s.titleNumber} onChange={uv("titleNumber")} placeholder="e.g. DU12345"/></Fld></div>
          <div style={S.r3}><Fld label="Owner Type"><select style={S.sel} disabled={!canEdit} value={s.ownerType||""} onChange={uv("ownerType")}><option value="">Unknown</option><option>Individual</option><option>Joint</option><option>Family Trust</option><option>Company</option><option>Charity</option><option>Public Body</option></select></Fld><Fld label="Tenure"><select style={S.sel} disabled={!canEdit} value={s.tenure||""} onChange={uv("tenure")}><option value="">Unknown</option><option>Freehold</option><option>Leasehold</option></select></Fld><Fld label="Owner Since"><input style={S.inp} type="date" disabled={!canEdit} value={s.ownerSince||""} onChange={uv("ownerSince")}/></Fld></div>
          <div style={S.r2}><Fld label="Contact / Address"><input style={S.inp} disabled={!canEdit} value={s.ownerContact||""} onChange={uv("ownerContact")}/></Fld><Fld label="Owner Solicitor"><input style={S.inp} disabled={!canEdit} value={s.ownerSolicitor||""} onChange={uv("ownerSolicitor")}/></Fld></div>
          <Div/>
          <div style={S.dSecT}>Approach & Agreement</div>
          <div style={S.r2}><div style={{paddingTop:"17px"}}><label style={{display:"flex",gap:"7px",alignItems:"center",fontSize:"11px",color:"rgba(245,241,234,0.7)"}}><input type="checkbox" disabled={!canEdit} checked={s.ownerApproached} onChange={e=>ub("ownerApproached")(e.target.checked)} style={{accentColor:B.navy}}/> Owner approached</label></div><Fld label="Approach Date"><input style={S.inp} type="date" disabled={!canEdit} value={s.approachDate} onChange={uv("approachDate")}/></Fld></div>
          <div style={S.r2}><div style={{paddingTop:"17px"}}><label style={{display:"flex",gap:"7px",alignItems:"center",fontSize:"11px",color:"rgba(245,241,234,0.7)"}}><input type="checkbox" disabled={!canEdit} checked={s.agreementSigned} onChange={e=>ub("agreementSigned")(e.target.checked)} style={{accentColor:B.green}}/> Agreement signed</label></div><Fld label="Agreement Date"><input style={S.inp} type="date" disabled={!canEdit} value={s.agreementDate} onChange={uv("agreementDate")}/></Fld></div>
          <div style={S.r2}><div style={{paddingTop:"17px"}}><label style={{display:"flex",gap:"7px",alignItems:"center",fontSize:"11px",color:"rgba(245,241,234,0.7)"}}><input type="checkbox" disabled={!canEdit} checked={s.restrictionRegistered||false} onChange={e=>ub("restrictionRegistered")(e.target.checked)} style={{accentColor:B.green}}/> HMLR restriction registered</label></div><Fld label="Exclusivity End"><input style={S.inp} type="date" disabled={!canEdit} value={s.exclusivityEnd||""} onChange={uv("exclusivityEnd")}/></Fld></div>
          <Fld label="Approach Notes"><textarea style={S.ta} disabled={!canEdit} value={s.ownerNotes||""} onChange={uv("ownerNotes")} placeholder="Sensitivities, relationship notes, key conversations..."/></Fld>
        </div>}

        {tab==="milestones"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}><div style={S.dSecT}>Milestones</div>{canEdit&&<button style={S.btnN} onClick={addMs}>+ Milestone</button>}</div>
          {(s.milestones||[]).length===0&&<div style={{fontSize:"11px",color:"rgba(245,241,234,0.3)",padding:"14px 0"}}>No milestones yet.</div>}
          {(s.milestones||[]).map(m=>{const ov=!m.done&&m.due&&new Date(m.due)<new Date();return<div key={m.id} style={{padding:"12px",background:m.done?B.greenP:ov?B.redP:"rgba(245,241,234,0.03)",border:`1px solid ${m.done?"rgba(46,125,50,0.18)":ov?"rgba(185,28,28,0.18)":B.ruleN}`,marginBottom:"6px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 100px 100px auto",gap:"8px",alignItems:"end",marginBottom:"6px"}}>
              <Fld label="Type"><select style={S.sel} disabled={!canEdit} value={m.type} onChange={e=>upMs(m.id,"type",e.target.value)}><option value="">Select...</option>{MILESTONE_TYPES.map(t=><option key={t}>{t}</option>)}</select></Fld>
              <Fld label="Date"><input style={S.inp} type="date" disabled={!canEdit} value={m.date} onChange={e=>upMs(m.id,"date",e.target.value)}/></Fld>
              <Fld label="Due"><input style={S.inp} type="date" disabled={!canEdit} value={m.due} onChange={e=>upMs(m.id,"due",e.target.value)}/></Fld>
              <div style={{display:"flex",gap:"5px",alignItems:"center",paddingTop:"17px"}}><label style={{fontSize:"9px",color:"rgba(245,241,234,0.4)",display:"flex",gap:"4px",alignItems:"center"}}><input type="checkbox" disabled={!canEdit} checked={m.done} onChange={e=>upMs(m.id,"done",e.target.checked)} style={{accentColor:B.green}}/>Done</label>{canEdit&&<button style={S.btnD} onClick={()=>delMs(m.id)}>\u2715</button>}</div>
            </div>
            <input style={S.inp} disabled={!canEdit} value={m.note} onChange={e=>upMs(m.id,"note",e.target.value)} placeholder="Note..."/>
          </div>;})}
        </div>}

        {tab==="costs"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}><div style={S.dSecT}>Cost Ledger</div>{canEdit&&<button style={S.btnN} onClick={addC}>+ Cost</button>}</div>
          {(s.costs||[]).length===0&&<div style={{fontSize:"11px",color:"rgba(245,241,234,0.3)",padding:"14px 0"}}>No costs recorded. All costs are recoverable from gross proceeds on completion.</div>}
          {(s.costs||[]).map(c=><div key={c.id} style={{padding:"10px",background:"rgba(245,241,234,0.03)",border:`1px solid ${B.ruleN}`,marginBottom:"6px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 90px 80px auto",gap:"7px",alignItems:"end"}}>
              <Fld label="Category"><select style={S.sel} disabled={!canEdit} value={c.category} onChange={e=>upC(c.id,"category",e.target.value)}><option value="">Select...</option>{COST_CATS.map(x=><option key={x}>{x}</option>)}</select></Fld>
              <Fld label="Description"><input style={S.inp} disabled={!canEdit} value={c.description} onChange={e=>upC(c.id,"description",e.target.value)}/></Fld>
              <Fld label="Amount (\u00a3)"><input style={S.inp} type="number" disabled={!canEdit} value={c.amount} onChange={e=>upC(c.id,"amount",e.target.value)}/></Fld>
              <Fld label="Date"><input style={S.inp} type="date" disabled={!canEdit} value={c.date} onChange={e=>upC(c.id,"date",e.target.value)}/></Fld>
              <div style={{display:"flex",flexDirection:"column",gap:"3px",paddingTop:"17px"}}>
                <label style={{fontSize:"8px",color:"rgba(245,241,234,0.35)",display:"flex",gap:"3px",alignItems:"center"}}><input type="checkbox" disabled={!canEdit} checked={c.recoverable} onChange={e=>upC(c.id,"recoverable",e.target.checked)} style={{accentColor:B.green}}/>Recov</label>
                <label style={{fontSize:"8px",color:"rgba(245,241,234,0.35)",display:"flex",gap:"3px",alignItems:"center"}}><input type="checkbox" disabled={!canEdit} checked={c.paid} onChange={e=>upC(c.id,"paid",e.target.checked)} style={{accentColor:B.navy}}/>Paid</label>
                {canEdit&&<button style={S.btnD} onClick={()=>delC(c.id)}>\u2715</button>}
              </div>
            </div>
          </div>)}
          {(s.costs||[]).length>0&&<div style={{background:B.navy,padding:"14px 18px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"16px"}}>
            {[{l:"Total",v:fmtC(totC),c:B.paper},{l:"Recoverable",v:fmtC(recC),c:B.gold},{l:"Non-Recoverable",v:fmtC(totC-recC),c:"rgba(245,241,234,0.4)"}].map(({l,v,c})=><div key={l}><div style={{fontSize:"8px",letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(245,241,234,0.3)",marginBottom:"3px"}}>{l}</div><div style={{fontFamily:"Georgia,serif",fontSize:"20px",color:c,lineHeight:1}}>{v}</div></div>)}
          </div>}
        </div>}

        {tab==="briefs"&&<div>
          <div style={S.dSecT}>Matched Buyer Briefs</div>
          {matchedBriefs.length===0?<div style={{fontSize:"11px",color:"rgba(245,241,234,0.3)",padding:"14px 0"}}>No active buyer briefs match this site. Add briefs in the Buyer Briefs section.</div>
          :matchedBriefs.map(brief=>{const pct=matchBrief(brief,s);return<div key={brief.id} style={{padding:"14px",background:"rgba(245,241,234,0.03)",border:`1px solid ${brief.relationship?`${B.gold}40`:B.ruleN}`,marginBottom:"8px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{display:"flex",gap:"6px",alignItems:"center",marginBottom:"4px"}}><span style={{fontSize:"12px",color:B.paper,fontWeight:400}}>{brief.developerName}</span>{brief.relationship&&<span style={S.badge(B.gold)}>\u2605 Relationship</span>}</div>
                <div style={{fontSize:"10px",color:"rgba(245,241,234,0.35)"}}>{brief.contactName||"No contact logged"}</div>
                {brief.notes&&<div style={{fontSize:"10px",color:"rgba(245,241,234,0.4)",marginTop:"5px",lineHeight:1.5}}>{brief.notes.substring(0,120)}\u2026</div>}
              </div>
              <div style={{textAlign:"right",paddingLeft:"12px"}}><div style={{fontFamily:"Georgia,serif",fontSize:"28px",color:pct>=80?B.green:pct>=60?B.amber:B.text4,lineHeight:1}}>{pct}%</div><div style={{fontSize:"8px",color:"rgba(245,241,234,0.3)",marginTop:"2px"}}>match</div></div>
            </div>
          </div>;})}
        </div>}

        {tab==="commission"&&<div>
          <div style={S.dSecT}>Commission Structure</div>
          <div style={{background:B.navy,padding:"18px",marginBottom:"12px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"16px"}}>
            {[{l:"Promoted Interest",v:`${comm.pi}%`,c:B.paper,sub:"Total Parcel carry"},{l:"DM Commission",v:`${comm.dm}%`,c:B.gold,sub:`${comm.cr}% of Parcel\u2019s carry`},{l:"Parcel Net",v:`${comm.parcel}%`,c:"rgba(245,241,234,0.5)",sub:"Retained by Parcel"}].map(({l,v,c,sub})=><div key={l}><div style={{fontSize:"8px",letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(245,241,234,0.3)",marginBottom:"4px"}}>{l}</div><div style={{fontFamily:"Georgia,serif",fontSize:"26px",color:c,lineHeight:1}}>{v}</div><div style={{fontSize:"9px",color:"rgba(245,241,234,0.25)",marginTop:"3px"}}>{sub}</div></div>)}
          </div>
          {isAdmin&&<div><div style={S.dSecT}>Adjust</div><div style={S.r2}><Fld label="Promoted Interest (%)"><input style={S.inp} type="number" value={s.promotedInterest} onChange={uv("promotedInterest")}/></Fld><Fld label="DM Commission Rate (%)"><input style={S.inp} type="number" value={s.commissionRate} onChange={uv("commissionRate")}/></Fld></div></div>}
          {dm&&<div style={{padding:"12px",background:"rgba(245,241,234,0.03)",border:`1px solid ${B.ruleN}`}}><div style={S.dSecT}>Assigned Deal Maker</div><div style={{fontSize:"12px",color:B.paper}}>{dm.name}</div><div style={{fontSize:"10px",color:"rgba(245,241,234,0.35)"}}>{dm.company||"Independent"} \u00b7 Claimed {fmtD(s.claimedAt)}</div></div>}
        </div>}

        {tab==="notes"&&canEdit&&<div>
          <div style={S.dSecT}>Notes</div>
          <textarea style={{...S.ta,minHeight:"160px"}} value={s.notes} onChange={uv("notes")} placeholder="Planning history, constraints, market context, landowner intel, next actions..."/>
          {isAdmin&&<><Div/><div style={{...S.dSecT,color:B.red}}>Danger Zone</div><div style={{display:"flex",gap:"10px",alignItems:"center"}}><button style={S.btnD} onClick={()=>{onDelete(s.id);onClose();}}>Delete Site</button><span style={{fontSize:"9px",color:"rgba(245,241,234,0.3)"}}>Permanently removes this site and all data.</span></div></>}
        </div>}
      </div>
      {canEdit&&<div style={{padding:"12px 22px",borderTop:`1px solid ${B.ruleN}`,background:B.navy,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div style={{fontSize:"9px",color:"rgba(245,241,234,0.25)"}}>Added {fmtD(s.createdAt)}</div>
        <div style={{display:"flex",gap:"7px"}}><button style={S.btnO} onClick={onClose}>Cancel</button><button style={S.btnG} onClick={()=>onSave(s)}>Save Changes</button></div>
      </div>}
    </div>
  </div>;
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({sites,dealMakers,briefs,currentUser,onOpenSite}){
  const isAdmin=currentUser.role==="admin";
  const myDm=!isAdmin?dealMakers.find(d=>d.id===currentUser.id):null;
  const mySites=myDm?sites.filter(s=>s.claimedBy===myDm.id):sites;
  const available=sites.filter(s=>s.status==="available"||s.status==="scored");
  const agreed=sites.filter(s=>s.agreementSigned);
  const odCount=mySites.filter(s=>overdueMs(s)>0).length;
  const highProb=sites.filter(s=>(s.probability||0)>=70);
  const totC=mySites.reduce((a,s)=>a+totalCosts(s),0);
  const byMkt=MARKETS.map(m=>({...m,count:sites.filter(s=>s.primaryMarket===m.id).length})).filter(m=>m.count>0);
  const recent=mySites.flatMap(s=>(s.milestones||[]).filter(m=>m.date).map(m=>({...m,site:s}))).sort((a,z)=>new Date(z.date)-new Date(a.date)).slice(0,5);
  const odSites=mySites.filter(s=>overdueMs(s)>0);
  const kpis=isAdmin?[
    {n:available.length,l:"Available Sites",sub:"Ready to claim",c:B.blue},
    {n:sites.filter(s=>!["completed","dead"].includes(s.status)).length,l:"Active Deals",sub:`${agreed.length} agreements signed`,c:B.gold2},
    {n:highProb.length,l:"High Probability",sub:"70%+ planning score",c:B.green},
    {n:odCount,l:"Overdue Actions",sub:"Needs attention",c:odCount>0?B.red:B.text4},
  ]:[
    {n:mySites.length,l:"My Sites",sub:"Active pipeline",c:B.gold2},
    {n:mySites.filter(s=>s.agreementSigned).length,l:"Agreements Signed",sub:"Promotion live",c:B.green},
    {n:mySites.filter(s=>s.tier==="T1").length,l:"Tier 1 Sites",sub:"Prime opportunities",c:B.green},
    {n:odCount,l:"Overdue Actions",sub:"Action needed",c:odCount>0?B.red:B.text4},
  ];
  return<div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px",marginBottom:"12px"}}>
      {kpis.map((k,i)=><div key={i} style={S.stat(k.c)}><div style={{...S.statN,color:k.n>0&&k.c===B.red?B.red:B.paper}}>{k.n}</div><div style={S.statL}>{k.l}</div><div style={{fontSize:"9px",color:"rgba(245,241,234,0.25)",marginTop:"2px"}}>{k.sub}</div></div>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
      <div>
        {isAdmin&&byMkt.length>0&&<div style={S.card}><div style={S.cardT}>Pipeline by Market</div>{byMkt.map(m=><div key={m.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${B.ruleN}`}}><div style={{display:"flex",alignItems:"center",gap:"7px"}}><span style={{fontSize:"13px"}}>{m.icon}</span><span style={{fontSize:"11px",color:"rgba(245,241,234,0.6)"}}>{m.label}</span>{m.launch&&<span style={S.badge(B.gold2)}>Live</span>}</div><span style={{fontFamily:"Georgia,serif",fontSize:"18px",color:m.color}}>{m.count}</span></div>)}</div>}
        {isAdmin&&<div style={S.card}><div style={S.cardT}>Deal Maker Activity</div>{dealMakers.filter(d=>d.active).length===0?<div style={{fontSize:"11px",color:"rgba(245,241,234,0.3)"}}>No deal makers registered yet.</div>:dealMakers.filter(d=>d.active).map(dm=>{const dc=sites.filter(s=>s.claimedBy===dm.id);return<div key={dm.id} style={{padding:"7px 0",borderBottom:`1px solid ${B.ruleN}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:"11px",color:"rgba(245,241,234,0.7)"}}>{dm.name}</div><div style={{fontSize:"9px",color:"rgba(245,241,234,0.3)"}}>{dc.length} sites</div></div><span style={{fontSize:"10px",color:B.green}}>{dc.filter(s=>s.status==="completed").length} completed</span></div></div>;})}
        </div>}
        {!isAdmin&&<div style={S.card}><div style={S.cardT}>My Pipeline</div>{mySites.length===0?<div style={{fontSize:"11px",color:"rgba(245,241,234,0.3)"}}>No sites claimed. Visit Site Marketplace.</div>:SITE_STATUSES.map(st=>{const c=mySites.filter(s=>s.status===st.id).length;if(!c)return null;return<div key={st.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${B.ruleN}`}}><span style={{fontSize:"11px",color:"rgba(245,241,234,0.6)"}}>{st.label}</span><span style={{fontFamily:"Georgia,serif",fontSize:"18px",color:st.color}}>{c}</span></div>;})}</div>}
        <div style={S.card}><div style={S.cardT}>Costs Committed</div><div style={{fontFamily:"Georgia,serif",fontSize:"30px",color:B.paper,lineHeight:1,marginBottom:"4px"}}>{fmtC(totC)}</div><div style={{fontSize:"9px",color:"rgba(245,241,234,0.3)"}}>All sites</div></div>
      </div>
      <div>
        {highProb.length>0&&<div style={S.card}><div style={S.cardT}>High Probability Sites (70%+)</div>{highProb.slice(0,4).map(s=><div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${B.ruleN}`,cursor:"pointer"}} onClick={()=>onOpenSite(s)}><div><div style={{fontSize:"11px",color:"rgba(245,241,234,0.8)"}}>{s.ref} \u2014 {s.name||"Unnamed"}</div><div style={{fontSize:"9px",color:"rgba(245,241,234,0.3)"}}>{s.lpa}</div></div><span style={{fontFamily:"Georgia,serif",fontSize:"18px",color:B.green}}>{s.probability}%</span></div>)}</div>}
        {odSites.length>0&&<div style={{...S.card,borderLeft:`3px solid ${B.red}`}}><div style={{...S.cardT,color:B.red}}>Overdue \u2014 Action Required</div>{odSites.flatMap(s=>(s.milestones||[]).filter(m=>!m.done&&m.due&&new Date(m.due)<new Date()).map(m=>({m,s}))).map(({m,s},i)=><div key={i} style={{display:"flex",gap:"12px",padding:"6px 0",borderBottom:`1px solid ${B.ruleN}`,alignItems:"center"}}><span style={{fontSize:"9px",color:B.red,minWidth:"76px"}}>Due {fmtD(m.due)}</span><div style={{flex:1}}><div style={{fontSize:"11px",color:"rgba(245,241,234,0.7)"}}>{m.type}</div><div style={{fontSize:"9px",color:"rgba(245,241,234,0.3)"}}>{s.ref}</div></div></div>)}</div>}
        {recent.length>0&&<div style={S.card}><div style={S.cardT}>Recent Activity</div>{recent.map(m=><div key={m.id} style={{display:"flex",gap:"12px",padding:"6px 0",borderBottom:`1px solid ${B.ruleN}`,alignItems:"flex-start"}}><span style={{fontSize:"9px",color:"rgba(245,241,234,0.3)",minWidth:"76px",paddingTop:"1px"}}>{fmtD(m.date)}</span><div><div style={{fontSize:"11px",color:"rgba(245,241,234,0.6)"}}>{m.type}</div><div style={{fontSize:"9px",color:"rgba(245,241,234,0.3)"}}>{m.site.ref} \u00b7 {m.site.name||"Unnamed"}</div></div></div>)}</div>}
      </div>
    </div>
  </div>;
}

// ─── PIPELINE ────────────────────────────────────────────────────────────────
function Pipeline({sites,dealMakers,currentUser,onOpen,onAdd}){
  const[stF,setStF]=useState("");const[mF,setMF]=useState("");const[dmF,setDmF]=useState("");const[srch,setSrch]=useState("");
  const isAdmin=currentUser.role==="admin";
  const myDm=!isAdmin?dealMakers.find(d=>d.id===currentUser.id):null;
  const filtered=sites.filter(s=>{
    if(!isAdmin&&s.claimedBy!==myDm?.id)return false;
    if(stF&&s.status!==stF)return false;
    if(mF&&s.primaryMarket!==mF)return false;
    if(dmF){if(dmF==="__none"&&s.claimedBy)return false;if(dmF!=="__none"&&s.claimedBy!==dmF)return false;}
    if(srch){const q=srch.toLowerCase();if(!`${s.ref} ${s.name} ${s.lpa} ${s.ownerName}`.toLowerCase().includes(q))return false;}
    return true;
  });
  return<div>
    <div style={{display:"flex",gap:"8px",marginBottom:"14px",flexWrap:"wrap",alignItems:"center"}}>
      <input style={{...S.inp,width:"200px"}} placeholder="Search..." value={srch} onChange={e=>setSrch(e.target.value)}/>
      <select style={{...S.sel,width:"170px"}} value={stF} onChange={e=>setStF(e.target.value)}><option value="">All statuses</option>{SITE_STATUSES.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}</select>
      <select style={{...S.sel,width:"190px"}} value={mF} onChange={e=>setMF(e.target.value)}><option value="">All markets</option>{MARKETS.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}</select>
      {isAdmin&&<select style={{...S.sel,width:"170px"}} value={dmF} onChange={e=>setDmF(e.target.value)}><option value="">All deal makers</option><option value="__none">Unclaimed</option>{dealMakers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select>}
      <div style={{flex:1}}/>
      {isAdmin&&<button style={S.btnG} onClick={onAdd}>+ Score &amp; Add Site</button>}
    </div>
    {filtered.length===0?<div style={{...S.card,textAlign:"center",padding:"40px"}}>
      {sites.length===0?<div><div style={{fontSize:"13px",color:"rgba(245,241,234,0.4)",marginBottom:"12px"}}>No sites yet.</div>{isAdmin&&<button style={S.btnG} onClick={onAdd}>Score &amp; Add First Site \u2192</button>}</div>:<div style={{fontSize:"12px",color:"rgba(245,241,234,0.4)"}}>No sites match your filters.</div>}
    </div>:<table style={S.tbl}><thead><tr>
      <th style={S.th}>Ref</th><th style={S.th}>Site</th><th style={S.th}>Market</th><th style={S.th}>Tier</th><th style={S.th}>Probability</th><th style={S.th}>Status</th>{isAdmin&&<th style={S.th}>Deal Maker</th>}<th style={S.th}>Costs</th>
    </tr></thead><tbody>{filtered.map((site,i)=>{
      const dm=dealMakers.find(d=>d.id===site.claimedBy);const ov=overdueMs(site);const prob=site.probability;
      return<tr key={site.id} style={{background:i%2===0?B.navy2:B.navy,cursor:"pointer"}} onClick={()=>onOpen(site)} onMouseEnter={e=>e.currentTarget.style.background=B.navy3} onMouseLeave={e=>e.currentTarget.style.background=i%2===0?B.navy2:B.navy}>
        <td style={{...S.td,fontWeight:500,color:B.gold,whiteSpace:"nowrap"}}>{site.ref}{ov>0&&<span style={{...S.badge(B.red),marginLeft:"5px"}}>{ov}!</span>}</td>
        <td style={S.td}><div style={{color:"rgba(245,241,234,0.8)"}}>{site.name||<span style={{color:"rgba(245,241,234,0.3)"}}>Unnamed</span>}</div><div style={{fontSize:"9px",color:"rgba(245,241,234,0.3)"}}>{site.area?`${site.area} acres`:""}</div></td>
        <td style={S.td}><MktBadge id={site.primaryMarket}/></td>
        <td style={S.td}><TierBadge id={site.tier}/>{site.score&&<div style={{fontSize:"9px",color:"rgba(245,241,234,0.3)",marginTop:"2px"}}>{site.score}</div>}</td>
        <td style={S.td}>{prob!=null?<div style={{display:"flex",alignItems:"center",gap:"6px"}}><div style={{width:"40px",height:"4px",background:"rgba(245,241,234,0.1)",borderRadius:"2px"}}><div style={{height:"100%",width:`${prob}%`,background:prob>=70?B.green:prob>=45?B.amber:B.red,borderRadius:"2px"}}/></div><span style={{fontFamily:"Georgia,serif",fontSize:"14px",color:prob>=70?B.green:prob>=45?B.amber:B.red}}>{prob}%</span></div>:<span style={{color:"rgba(245,241,234,0.25)"}}>Unscored</span>}</td>
        <td style={S.td}><StBadge id={site.status}/></td>
        {isAdmin&&<td style={S.td}>{dm?<span style={{fontSize:"11px",color:"rgba(245,241,234,0.7)"}}>{dm.name}</span>:<span style={S.badge(B.blue)}>Unclaimed</span>}</td>}
        <td style={S.td}><span style={{fontSize:"11px",color:totalCosts(site)>0?"rgba(245,241,234,0.7)":"rgba(245,241,234,0.2)"}}>{totalCosts(site)>0?fmtC(totalCosts(site)):"\u2014"}</span></td>
      </tr>;
    })}</tbody></table>}
    <div style={{fontSize:"9px",color:"rgba(245,241,234,0.25)",marginTop:"7px"}}>{filtered.length} sites shown</div>
  </div>;
}

// ─── BUYER BRIEFS ─────────────────────────────────────────────────────────────
function BuyerBriefs({briefs,sites,dealMakers,currentUser,onSave,onDelete}){
  const[editing,setEditing]=useState(null);const[adding,setAdding]=useState(false);
  const isAdmin=currentUser.role==="admin";
  const myDm=!isAdmin?dealMakers.find(d=>d.id===currentUser.id):null;
  const myBriefs=isAdmin?briefs:briefs.filter(b=>b.dealMakerId===myDm?.id);
  const getMatches=brief=>sites.filter(s=>s.status==="available"||s.status==="scored").map(s=>({s,pct:matchBrief(brief,s)})).filter(x=>x.pct>=60).sort((a,z)=>z.pct-a.pct);
  const loadPresets=()=>{const ex=briefs.map(b=>b.developerName);PRESET_BRIEFS.filter(p=>!ex.includes(p.developerName)).forEach(p=>onSave({...blankBrief(),...p}));};
  return<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
      <div style={{fontSize:"10px",color:"rgba(245,241,234,0.4)"}}>Developer requirements \u2014 auto-matched against available pipeline</div>
      <div style={{display:"flex",gap:"8px"}}>
        {isAdmin&&<button style={{...S.btnO,borderColor:`${B.gold}40`,color:B.gold2}} onClick={loadPresets}>\u229e Load Buyer Library</button>}
        <button style={S.btnG} onClick={()=>{const b=blankBrief();if(myDm)b.dealMakerId=myDm.id;setEditing(b);setAdding(true);}}>+ New Brief</button>
      </div>
    </div>
    {myBriefs.length===0&&!editing?<div style={{...S.card,textAlign:"center",padding:"40px"}}>
      <div style={{fontSize:"12px",color:"rgba(245,241,234,0.4)",marginBottom:"8px"}}>No buyer briefs yet.</div>
      {isAdmin&&<button style={{...S.btnO,borderColor:`${B.gold}40`,color:B.gold2,marginRight:"8px"}} onClick={loadPresets}>\u229e Load Buyer Library</button>}
      <button style={S.btnG} onClick={()=>{setEditing(blankBrief());setAdding(true);}}>+ Add Brief</button>
    </div>
    :<div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
      {[...myBriefs].sort((a,z)=>(z.priority||3)-(a.priority||3)).map(brief=>{
        const dm2=dealMakers.find(d=>d.id===brief.dealMakerId);const matches=getMatches(brief);
        return<div key={brief.id} style={{...S.card,borderLeft:`3px solid ${brief.relationship?B.gold:brief.active?B.blue:B.text4}`,cursor:"pointer",marginBottom:0}} onClick={()=>{setEditing(JSON.parse(JSON.stringify(brief)));setAdding(false);}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:"6px",alignItems:"center",marginBottom:"4px"}}>
                <span style={{fontSize:"13px",color:"rgba(245,241,234,0.85)",fontWeight:400}}>{brief.developerName||"Developer TBC"}</span>
                {brief.relationship&&<span style={S.badge(B.gold)}>\u2605 Relationship</span>}
                {brief.active?<span style={S.badge(B.blue)}>Active</span>:<span style={S.badge(B.text4)}>Inactive</span>}
                {isAdmin&&dm2&&<span style={S.badge(B.gold2)}>{dm2.name}</span>}
              </div>
              <div style={{fontSize:"10px",color:"rgba(245,241,234,0.35)"}}>{brief.contactName&&`${brief.contactName} \u00b7 `}{brief.markets.length>0?brief.markets.map(m=>getMkt(m).label).join(", "):"All markets"}{(brief.minAcres||brief.maxAcres)?` \u00b7 ${brief.minAcres||"0"}\u2013${brief.maxAcres||"any"} acres`:""}</div>
              {brief.notes&&<div style={{fontSize:"10px",color:"rgba(245,241,234,0.35)",marginTop:"5px",lineHeight:1.5,maxWidth:"500px"}}>{brief.notes.substring(0,100)}{brief.notes.length>100?"\u2026":""}</div>}
              <div style={{marginTop:"7px",display:"flex",gap:"4px",flexWrap:"wrap"}}>{brief.markets.map(m=><MktBadge key={m} id={m}/>)}{brief.tiers.map(t=><TierBadge key={t} id={t}/>)}</div>
            </div>
            <div style={{textAlign:"right",paddingLeft:"14px"}}><div style={{fontFamily:"Georgia,serif",fontSize:"28px",color:matches.length>0?B.blue:B.text4,lineHeight:1}}>{matches.length}</div><div style={{fontSize:"8px",color:"rgba(245,241,234,0.3)",letterSpacing:"0.1em",textTransform:"uppercase"}}>Matching</div>{(brief.priority||0)>=5&&<div style={{fontSize:"8px",color:B.gold2,marginTop:"5px",letterSpacing:"0.08em"}}>PRIORITY</div>}</div>
          </div>
        </div>;
      })}
    </div>}
    {editing&&<div style={S.overlay} onClick={e=>e.target===e.currentTarget&&setEditing(null)}>
      <div style={S.drawer}>
        <div style={S.dHead}><div style={{fontFamily:"Georgia,serif",fontSize:"16px",color:B.paper}}>{adding?"New Buyer Brief":editing.developerName||"Edit Brief"}</div><button style={{...S.btnO,color:"rgba(245,241,234,0.35)"}} onClick={()=>setEditing(null)}>\u2715</button></div>
        <div style={S.dBody}>
          <div style={S.dSecT}>Developer Details</div>
          <div style={S.r2}><Fld label="Developer / Company"><input style={S.inp} value={editing.developerName} onChange={e=>setEditing(p=>({...p,developerName:e.target.value}))}/></Fld><Fld label="Contact Name"><input style={S.inp} value={editing.contactName} onChange={e=>setEditing(p=>({...p,contactName:e.target.value}))}/></Fld></div>
          <div style={S.r2}><Fld label="Email"><input style={S.inp} type="email" value={editing.email} onChange={e=>setEditing(p=>({...p,email:e.target.value}))}/></Fld><Fld label="Phone"><input style={S.inp} value={editing.phone||""} onChange={e=>setEditing(p=>({...p,phone:e.target.value}))}/></Fld></div>
          <div style={S.r2}>{isAdmin&&<Fld label="Assigned Deal Maker"><select style={S.sel} value={editing.dealMakerId||""} onChange={e=>setEditing(p=>({...p,dealMakerId:e.target.value||null}))}><option value="">Unassigned</option>{dealMakers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></Fld>}<div style={{paddingTop:"17px"}}><label style={{display:"flex",gap:"7px",alignItems:"center",fontSize:"11px",color:"rgba(245,241,234,0.7)"}}><input type="checkbox" checked={editing.relationship||false} onChange={e=>setEditing(p=>({...p,relationship:e.target.checked}))} style={{accentColor:B.gold}}/> \u2605 Personal relationship exists</label></div></div>
          <Div/>
          <div style={S.dSecT}>Site Requirements</div>
          <div style={{marginBottom:"12px"}}><MultiSel label="Markets" options={MARKETS} value={editing.markets} onChange={v=>setEditing(p=>({...p,markets:v}))}/><div style={{fontSize:"9px",color:"rgba(245,241,234,0.25)",marginTop:"4px"}}>Leave blank to match all markets</div></div>
          <div style={{marginBottom:"12px"}}><MultiSel label="Minimum Tier" options={TIERS.filter(t=>t.id!=="--")} value={editing.tiers} onChange={v=>setEditing(p=>({...p,tiers:v}))}/></div>
          <div style={S.r2}><Fld label="Min Size (acres)"><input style={S.inp} type="number" value={editing.minAcres} onChange={e=>setEditing(p=>({...p,minAcres:e.target.value}))}/></Fld><Fld label="Max Size (acres)"><input style={S.inp} type="number" value={editing.maxAcres} onChange={e=>setEditing(p=>({...p,maxAcres:e.target.value}))}/></Fld></div>
          <Fld label="Notes &amp; Requirements"><textarea style={S.ta} value={editing.notes} onChange={e=>setEditing(p=>({...p,notes:e.target.value}))} placeholder="Site criteria, location preferences, planning status, specific requirements..."/></Fld>
          <div style={{marginTop:"10px"}}><label style={{display:"flex",gap:"7px",alignItems:"center",fontSize:"11px",color:"rgba(245,241,234,0.7)"}}><input type="checkbox" checked={editing.active} onChange={e=>setEditing(p=>({...p,active:e.target.checked}))} style={{accentColor:B.blue}}/> Brief is active \u2014 match against pipeline</label></div>
          <Div/>
          <div style={S.dSecT}>Live Matching Sites</div>
          {getMatches(editing).length===0?<div style={{fontSize:"11px",color:"rgba(245,241,234,0.3)"}}>No available sites match this brief currently.</div>:getMatches(editing).map(({s,pct})=><div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${B.ruleN}`}}><div><div style={{fontSize:"11px",color:"rgba(245,241,234,0.7)"}}>{s.ref} \u2014 {s.name||"Unnamed"}</div><div style={{fontSize:"9px",color:"rgba(245,241,234,0.3)"}}>{s.lpa} \u00b7 {s.area?`${s.area} acres`:""}</div></div><div style={{display:"flex",gap:"5px",alignItems:"center"}}><span style={{fontSize:"10px",color:pct>=80?B.green:B.amber,fontWeight:500}}>{pct}%</span><TierBadge id={s.tier}/><MktBadge id={s.primaryMarket}/></div></div>)}
          {!adding&&<><Div/><div style={{...S.dSecT,color:B.red}}>Remove</div><button style={S.btnD} onClick={()=>{onDelete(editing.id);setEditing(null);}}>Remove Brief</button></>}
        </div>
        <div style={{padding:"12px 22px",borderTop:`1px solid ${B.ruleN}`,background:B.navy,display:"flex",justifyContent:"flex-end",gap:"7px",flexShrink:0}}><button style={S.btnO} onClick={()=>setEditing(null)}>Cancel</button><button style={S.btnG} onClick={()=>{onSave(editing);setEditing(null);}}>{adding?"Save Brief":"Save Changes"}</button></div>
      </div>
    </div>}
  </div>;
}

// ─── DEAL MAKERS ─────────────────────────────────────────────────────────────
function DealMakers({dealMakers,sites,onSave,onDelete}){
  const[editing,setEditing]=useState(null);const[adding,setAdding]=useState(false);
  return<div>
    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:"12px"}}><button style={S.btnG} onClick={()=>{setEditing(blankDM());setAdding(true);}}>+ Register Deal Maker</button></div>
    {dealMakers.length===0&&!editing?<div style={{...S.card,textAlign:"center",padding:"40px"}}><div style={{fontSize:"12px",color:"rgba(245,241,234,0.4)",marginBottom:"12px"}}>No deal makers registered yet.</div><button style={S.btnG} onClick={()=>{setEditing(blankDM());setAdding(true);}}>Register First Deal Maker \u2192</button></div>
    :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>{dealMakers.map(dm=>{const claimed=sites.filter(s=>s.claimedBy===dm.id);const od=claimed.filter(s=>overdueMs(s)>0).length;
      return<div key={dm.id} style={{...S.card,cursor:"pointer",borderLeft:`3px solid ${dm.active?B.gold:B.text4}`,marginBottom:0}} onClick={()=>{setEditing(JSON.parse(JSON.stringify(dm)));setAdding(false);}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:"13px",color:"rgba(245,241,234,0.85)",fontWeight:400,marginBottom:"3px"}}>{dm.name}</div><div style={{fontSize:"10px",color:"rgba(245,241,234,0.35)"}}>{dm.company||"Independent"}</div><div style={{fontSize:"10px",color:"rgba(245,241,234,0.35)"}}>{dm.email}</div></div><div style={{textAlign:"right"}}>{dm.active?<span style={S.badge(B.green)}>Active</span>:<span style={S.badge(B.text4)}>Inactive</span>}{od>0&&<div style={{marginTop:"4px"}}><span style={S.badge(B.red)}>{od} overdue</span></div>}</div></div>
        <div style={{marginTop:"12px",display:"flex",gap:"16px"}}>{[{n:claimed.length,l:"Sites"},{n:claimed.filter(s=>s.status==="completed").length,l:"Completed"},{n:claimed.filter(s=>s.agreementSigned).length,l:"Agreed"}].map(({n,l})=><div key={l}><div style={{fontFamily:"Georgia,serif",fontSize:"18px",color:B.paper,lineHeight:1}}>{n}</div><div style={{fontSize:"8px",color:"rgba(245,241,234,0.3)",letterSpacing:"0.1em",textTransform:"uppercase"}}>{l}</div></div>)}</div>
        <div style={{marginTop:"10px",display:"flex",flexWrap:"wrap",gap:"4px"}}>{(dm.markets||[]).map(m=><MktBadge key={m} id={m}/>)}</div>
      </div>;})}
    </div>}
    {editing&&<div style={S.overlay} onClick={e=>e.target===e.currentTarget&&setEditing(null)}>
      <div style={S.drawer}>
        <div style={S.dHead}><div style={{fontFamily:"Georgia,serif",fontSize:"16px",color:B.paper}}>{adding?"Register Deal Maker":editing.name||"Edit Deal Maker"}</div><button style={{...S.btnO,color:"rgba(245,241,234,0.35)"}} onClick={()=>setEditing(null)}>\u2715</button></div>
        <div style={S.dBody}>
          <div style={S.dSecT}>Details</div>
          <div style={S.r2}><Fld label="Full Name"><input style={S.inp} value={editing.name} onChange={e=>setEditing(p=>({...p,name:e.target.value}))}/></Fld><Fld label="Company / Agency"><input style={S.inp} value={editing.company} onChange={e=>setEditing(p=>({...p,company:e.target.value}))}/></Fld></div>
          <div style={S.r2}><Fld label="Email"><input style={S.inp} type="email" value={editing.email} onChange={e=>setEditing(p=>({...p,email:e.target.value}))}/></Fld><Fld label="Phone"><input style={S.inp} value={editing.phone} onChange={e=>setEditing(p=>({...p,phone:e.target.value}))}/></Fld></div>
          <div style={S.r2}><Fld label="Date Joined"><input style={S.inp} type="date" value={editing.joinedAt} onChange={e=>setEditing(p=>({...p,joinedAt:e.target.value}))}/></Fld><div style={{paddingTop:"17px"}}><label style={{display:"flex",gap:"7px",alignItems:"center",fontSize:"11px",color:"rgba(245,241,234,0.7)"}}><input type="checkbox" checked={editing.active} onChange={e=>setEditing(p=>({...p,active:e.target.checked}))} style={{accentColor:B.green}}/> Active agent</label></div></div>
          <Div/>
          <div style={S.dSecT}>Markets</div>
          <MultiSel label="Active Markets" options={MARKETS} value={editing.markets} onChange={v=>setEditing(p=>({...p,markets:v}))}/>
          <div style={{fontSize:"9px",color:"rgba(245,241,234,0.25)",marginTop:"6px"}}>Leave blank to show all markets in the marketplace.</div>
          <Div/>
          <Fld label="Notes"><textarea style={S.ta} value={editing.notes} onChange={e=>setEditing(p=>({...p,notes:e.target.value}))} placeholder="Regions of specialism, relationship notes..."/></Fld>
          {!adding&&<><Div/><div style={{...S.dSecT,color:B.red}}>Remove</div><button style={S.btnD} onClick={()=>{onDelete(editing.id);setEditing(null);}}>Remove Deal Maker</button></>}
        </div>
        <div style={{padding:"12px 22px",borderTop:`1px solid ${B.ruleN}`,background:B.navy,display:"flex",justifyContent:"flex-end",gap:"7px",flexShrink:0}}><button style={S.btnO} onClick={()=>setEditing(null)}>Cancel</button><button style={S.btnG} onClick={()=>{onSave(editing);setEditing(null);}}>{adding?"Register":"Save Changes"}</button></div>
      </div>
    </div>}
  </div>;
}

// ─── MARKETPLACE ─────────────────────────────────────────────────────────────
function Marketplace({sites,currentUser,dealMakers,onClaim,onOpen}){
  const[mF,setMF]=useState("");const[tF,setTF]=useState("");
  const available=sites.filter(s=>{
    if(s.status!=="available"&&s.status!=="scored")return false;
    if(mF&&s.primaryMarket!==mF)return false;
    if(tF&&s.tier!==tF)return false;
    return true;
  });
  return<div>
    <div style={{...S.card,background:B.navy,borderColor:B.navy,marginBottom:"14px"}}>
      <div style={{fontSize:"9px",letterSpacing:"0.2em",textTransform:"uppercase",color:B.gold,marginBottom:"6px",fontWeight:500}}>Site Marketplace</div>
      <div style={{fontSize:"12px",color:"rgba(245,241,234,0.6)",lineHeight:1.7,fontWeight:300}}>Claim a site to take it through the promotion process. You earn <strong style={{color:B.gold}}>10% of Parcel\u2019s promoted interest</strong> on completion. Once claimed, the site is assigned to you.</div>
    </div>
    <div style={{display:"flex",gap:"8px",marginBottom:"12px",alignItems:"center"}}>
      <select style={{...S.sel,width:"200px"}} value={mF} onChange={e=>setMF(e.target.value)}><option value="">All markets</option>{MARKETS.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}</select>
      <select style={{...S.sel,width:"160px"}} value={tF} onChange={e=>setTF(e.target.value)}><option value="">All tiers</option>{TIERS.filter(t=>t.id!=="--").map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</select>
      <div style={{fontSize:"10px",color:"rgba(245,241,234,0.35)",marginLeft:"4px"}}>{available.length} available</div>
    </div>
    {available.length===0?<div style={{...S.card,textAlign:"center",padding:"40px",color:"rgba(245,241,234,0.3)"}}><div style={{fontSize:"12px",marginBottom:"8px"}}>No available sites match your filters.</div><div style={{fontSize:"10px"}}>New sites appear here as they clear the scoring gate.</div></div>
    :<div style={{display:"flex",flexDirection:"column",gap:"8px"}}>{available.map(site=>{
      const pi=parseFloat(site.promotedInterest)||25;const cr=parseFloat(site.commissionRate)||10;const dmPct=(pi*(cr/100)).toFixed(1);const prob=site.probability;
      return<div key={site.id} style={{...S.card,borderLeft:`3px solid ${getMkt(site.primaryMarket).color}`,cursor:"pointer",marginBottom:0}} onClick={()=>onOpen(site)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:"6px",alignItems:"center",marginBottom:"5px"}}><span style={{fontFamily:"Georgia,serif",fontSize:"15px",color:B.paper,fontWeight:600}}>{site.ref}</span><TierBadge id={site.tier}/><MktBadge id={site.primaryMarket}/>{(site.secondaryMarkets||[]).map(m=><MktBadge key={m} id={m}/>)}</div>
            <div style={{fontSize:"12px",color:"rgba(245,241,234,0.7)",fontWeight:400,marginBottom:"3px"}}>{site.name||"Site location TBC"}</div>
            <div style={{fontSize:"10px",color:"rgba(245,241,234,0.35)"}}>{site.lpa}{site.area?` \u00b7 ${site.area} acres`:""}</div>
            {prob!=null&&<div style={{display:"flex",alignItems:"center",gap:"6px",marginTop:"6px"}}><div style={{width:"60px",height:"4px",background:"rgba(245,241,234,0.1)",borderRadius:"2px"}}><div style={{height:"100%",width:`${prob}%`,background:prob>=70?B.green:prob>=45?B.amber:B.red,borderRadius:"2px"}}/></div><span style={{fontSize:"10px",color:prob>=70?B.green:prob>=45?B.amber:B.red,fontWeight:500}}>{prob}% planning probability</span></div>}
          </div>
          <div style={{textAlign:"right",paddingLeft:"16px"}}>
            <div style={{fontSize:"8px",letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(245,241,234,0.3)",marginBottom:"4px"}}>Your commission</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:"26px",color:B.green,lineHeight:1}}>{dmPct}%</div>
            <div style={{fontSize:"9px",color:"rgba(245,241,234,0.3)"}}>of net proceeds</div>
            <button style={{...S.btnG,marginTop:"10px",padding:"7px 14px"}} onClick={e=>{e.stopPropagation();onClaim(site.id);}}>Claim Site \u2192</button>
          </div>
        </div>
      </div>;
    })}</div>}
  </div>;
}

// ─── NEW SITE FLOW ────────────────────────────────────────────────────────────
function NewSiteFlow({nextId,onSave,onCancel}){
  const[phase,setPhase]=useState(1);
  const[site,setSite]=useState(()=>blankSite(nextId));
  const handleScoreComplete=data=>{setSite(p=>({...p,...data}));setPhase(3);};
  if(phase===1) return<div>
    <div style={{...S.card,borderColor:`${B.gold}30`,background:"rgba(201,166,107,0.04)",marginBottom:"16px"}}><div style={{fontSize:"9px",letterSpacing:"0.18em",textTransform:"uppercase",color:B.gold,marginBottom:"6px",fontWeight:500}}>Step 1 of 2 \u2014 Site Details</div><div style={{fontSize:"12px",color:"rgba(245,241,234,0.5)",lineHeight:1.75}}>Enter basic site details then score it. The score result creates the pipeline entry automatically with tier, probability, and asset class data pre-filled.</div></div>
    <div style={S.card}>
      <div style={S.dSecT}>Site Details</div>
      <div style={S.r2}><Fld label="Site Name / Address"><input style={S.inp} value={site.name} onChange={e=>setSite(p=>({...p,name:e.target.value}))} placeholder="e.g. Land south of Yarm Road"/></Fld><Fld label="Reference"><input style={S.inp} value={site.ref} onChange={e=>setSite(p=>({...p,ref:e.target.value}))}/></Fld></div>
      <div style={S.r3}><Fld label="Stream"><select style={S.sel} value={site.stream} onChange={e=>setSite(p=>({...p,stream:e.target.value}))}><option value="S1">Stream 1 \u2014 Promotion</option><option value="S2">Stream 2 \u2014 Development</option></select></Fld><Fld label="Primary Market"><select style={S.sel} value={site.primaryMarket} onChange={e=>setSite(p=>({...p,primaryMarket:e.target.value}))}>{MARKETS.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}</select></Fld><Fld label="Area (acres)"><input style={S.inp} type="number" value={site.area} onChange={e=>setSite(p=>({...p,area:e.target.value}))} placeholder="e.g. 12"/></Fld></div>
      <div style={S.r2}><Fld label="LPA"><select style={S.sel} value={site.lpa} onChange={e=>setSite(p=>({...p,lpa:e.target.value}))}><option value="">Select...</option><optgroup label="NECA">{LPAS_NECA.map(l=><option key={l}>{l}</option>)}</optgroup><optgroup label="TVCA">{LPAS_TVCA.map(l=><option key={l}>{l}</option>)}</optgroup><option>Other</option></select></Fld><Fld label="Current Use"><input style={S.inp} value={site.currentUse} onChange={e=>setSite(p=>({...p,currentUse:e.target.value}))} placeholder="e.g. Agricultural \u2014 arable"/></Fld></div>
    </div>
    <div style={{display:"flex",gap:"8px"}}><button style={S.btnO} onClick={onCancel}>Cancel</button><button style={{...S.btnG,flex:1}} onClick={()=>setPhase(2)}>Score This Site \u2192</button></div>
  </div>;
  if(phase===2) return<div>
    <div style={{...S.card,borderColor:`${B.gold}30`,background:"rgba(201,166,107,0.04)",marginBottom:"16px"}}><div style={{fontSize:"9px",letterSpacing:"0.18em",textTransform:"uppercase",color:B.gold,marginBottom:"4px",fontWeight:500}}>Step 2 of 2 \u2014 Scoring: {site.ref}{site.name?` \u00b7 ${site.name}`:""}</div><div style={{fontSize:"11px",color:"rgba(245,241,234,0.4)"}}>Select asset classes and complete binary scoring. The result creates the pipeline entry.</div></div>
    <ScoringWizard site={site} onComplete={handleScoreComplete} onCancel={()=>setPhase(1)}/>
  </div>;
  if(phase===3){const res=computeResults(site.scores||{},site.selectedAssets||[],site.consultantOverride||"0");return<div>
    <div style={{...S.card,borderColor:`${res.prob.band.color}30`,borderLeft:`4px solid ${res.prob.band.color}`,marginBottom:"14px"}}>
      <div style={{fontSize:"9px",letterSpacing:"0.18em",textTransform:"uppercase",color:res.prob.band.color,marginBottom:"6px",fontWeight:500}}>Score Complete \u2014 {site.ref}</div>
      <div style={{display:"flex",gap:"24px",alignItems:"center"}}>
        <div><div style={{fontFamily:"Georgia,serif",fontSize:"48px",color:res.prob.band.color,lineHeight:0.9}}>{res.prob.final}<span style={{fontSize:"22px",opacity:0.6}}>%</span></div><div style={{fontSize:"11px",color:"rgba(245,241,234,0.6)",marginTop:"5px"}}>{res.prob.band.label}</div></div>
        <div><TierBadge id={res.tier.id}/><div style={{fontFamily:"Georgia,serif",fontSize:"22px",color:res.tier.color,marginTop:"6px"}}>{res.tot}/{res.max}</div></div>
        <div style={{flex:1,fontSize:"11px",color:"rgba(245,241,234,0.5)",lineHeight:1.7}}>{res.prob.band.desc}</div>
      </div>
    </div>
    <div style={S.card}><div style={S.dSecT}>Adding to pipeline as</div><div style={S.r3}><div><div style={S.lbl}>Reference</div><div style={{fontSize:"13px",color:B.paper}}>{site.ref}</div></div><div><div style={S.lbl}>LPA</div><div style={{fontSize:"12px",color:"rgba(245,241,234,0.7)"}}>{site.lpa||"\u2014"}</div></div><div><div style={S.lbl}>Status</div><div style={{fontSize:"12px",color:B.blue}}>Available</div></div></div></div>
    <div style={{display:"flex",gap:"8px"}}><button style={S.btnO} onClick={()=>setPhase(2)}>\u2190 Re-Score</button><button style={{...S.btnG,flex:1}} onClick={()=>{onSave({...site,status:"available"});onCancel();}}>Add to Pipeline \u2192</button></div>
  </div>;}
  return null;
}

// ─── USER SWITCHER ────────────────────────────────────────────────────────────
function UserSwitcher({state,onSwitch}){
  const[open,setOpen]=useState(false);
  const cu=state.currentUser;const dm=state.dealMakers.find(d=>d.id===cu.id);
  return<div style={{position:"relative"}}>
    <button style={{...S.btnO,fontSize:"9px",display:"flex",alignItems:"center",gap:"5px"}} onClick={()=>setOpen(o=>!o)}>
      <span style={{color:cu.role==="admin"?B.gold:B.blue}}>\u25cf</span>{cu.role==="admin"?"Parcel Admin":dm?.name||"Deal Maker"} \u25be
    </button>
    {open&&<div style={{position:"absolute",top:"100%",right:0,background:B.navy2,border:`1px solid ${B.ruleN}`,minWidth:"200px",zIndex:200,boxShadow:"0 4px 16px rgba(0,0,0,0.3)"}}>
      <div style={{padding:"8px 12px",fontSize:"8px",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(245,241,234,0.25)",borderBottom:`1px solid ${B.ruleN}`}}>Switch View (Demo)</div>
      <div style={{padding:"7px 12px",fontSize:"11px",color:cu.role==="admin"?B.gold:"rgba(245,241,234,0.5)",background:cu.role==="admin"?"rgba(201,166,107,0.08)":"transparent",cursor:"pointer"}} onClick={()=>{onSwitch({id:"admin_1",role:"admin",name:"Parcel Admin"});setOpen(false);}}>&#9672; Parcel Admin</div>
      {state.dealMakers.map(d=><div key={d.id} style={{padding:"7px 12px",fontSize:"11px",color:cu.id===d.id?B.blue:"rgba(245,241,234,0.5)",background:cu.id===d.id?"rgba(26,82,118,0.1)":"transparent",cursor:"pointer"}} onClick={()=>{onSwitch({id:d.id,role:"dealmaker",name:d.name});setOpen(false);}}>&#9675; {d.name}</div>)}
      {state.dealMakers.length===0&&<div style={{padding:"7px 12px",fontSize:"10px",color:"rgba(245,241,234,0.25)"}}>Register a deal maker to switch view</div>}
    </div>}
  </div>;
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const[state,setState]=useState(()=>load());
  const[view,setView]=useState("dashboard");
  const[selectedSite,setSelectedSite]=useState(null);
  const[addingNew,setAddingNew]=useState(false);

  // Note: data persists during session only — connect Supabase in Phase 4 for full persistence

  const isAdmin=state.currentUser.role==="admin";
  const saveSite=useCallback(site=>{setState(p=>({...p,sites:p.sites.find(x=>x.id===site.id)?p.sites.map(x=>x.id===site.id?site:x):[...p.sites,site],nextId:p.sites.find(x=>x.id===site.id)?p.nextId:p.nextId+1}));setSelectedSite(null);},[]);
  const deleteSite=useCallback(id=>setState(p=>({...p,sites:p.sites.filter(x=>x.id!==id)})),[]);
  const claimSite=useCallback(id=>{const dm=state.dealMakers.find(d=>d.id===state.currentUser.id);if(!dm)return;setState(p=>({...p,sites:p.sites.map(s=>s.id===id?{...s,claimedBy:dm.id,claimedAt:new Date().toISOString().slice(0,10),status:"claimed"}:s)}));},[state.currentUser,state.dealMakers]);
  const unclaimSite=useCallback(id=>setState(p=>({...p,sites:p.sites.map(s=>s.id===id?{...s,claimedBy:null,claimedAt:null,status:"available"}:s)})),[]);
  const saveDM=useCallback(dm=>setState(p=>({...p,dealMakers:p.dealMakers.find(x=>x.id===dm.id)?p.dealMakers.map(x=>x.id===dm.id?dm:x):[...p.dealMakers,dm]})),[]);
  const deleteDM=useCallback(id=>setState(p=>({...p,dealMakers:p.dealMakers.filter(x=>x.id!==id),sites:p.sites.map(s=>s.claimedBy===id?{...s,claimedBy:null,status:"available"}:s)})),[]);
  const saveBrief=useCallback(b=>setState(p=>({...p,briefs:p.briefs.find(x=>x.id===b.id)?p.briefs.map(x=>x.id===b.id?b:x):[...p.briefs,b]})),[]);
  const deleteBrief=useCallback(id=>setState(p=>({...p,briefs:p.briefs.filter(x=>x.id!==id)})),[]);

  const adminNav=[{id:"dashboard",label:"Dashboard",icon:"\u25c8"},{id:"pipeline",label:"Pipeline",icon:"\u229e"},{id:"score",label:"Score New Site",icon:"\u25ce"},{id:"briefs",label:"Buyer Briefs",icon:"\u25e7"},{id:"dealmakers",label:"Deal Makers",icon:"\u2299"}];
  const dmNav=[{id:"dashboard",label:"Dashboard",icon:"\u25c8"},{id:"marketplace",label:"Site Marketplace",icon:"\u229e"},{id:"pipeline",label:"My Sites",icon:"\u25ce"},{id:"briefs",label:"My Briefs",icon:"\u25e7"}];
  const nav=isAdmin?adminNav:dmNav;
  const titles={dashboard:"Dashboard",pipeline:isAdmin?"Site Pipeline":"My Sites",score:"Score New Site",briefs:"Buyer Briefs",dealmakers:"Deal Makers",marketplace:"Site Marketplace"};

  return<div style={S.app}>
    <div style={S.sb}>
      <div style={S.sbTop}><div style={S.sbMark}>Parcel<span style={S.sbDot}>.</span></div><div style={S.sbSub}>Intelligence CRM</div></div>
      <div style={{flex:1,paddingTop:"8px",overflowY:"auto"}}>
        <div style={S.sbSecLbl}>{isAdmin?"Admin":"Deal Maker"}</div>
        {nav.map(item=><button key={item.id} style={S.sbItem(view===item.id&&!addingNew)} onClick={()=>{setView(item.id);setAddingNew(false);setSelectedSite(null);}}>
          <span style={{fontSize:"13px"}}>{item.icon}</span><span>{item.label}</span>
        </button>)}
        <div style={S.sbSecLbl}>Markets \u2014 Live</div>
        {MARKETS.filter(m=>m.launch).map(m=><div key={m.id} style={{padding:"4px 18px 4px 24px",fontSize:"10px",color:"rgba(245,241,234,0.35)",display:"flex",alignItems:"center",gap:"6px"}}><span>{m.icon}</span><span>{m.label}</span><span style={{marginLeft:"auto",fontSize:"7px",background:"rgba(201,166,107,0.12)",color:B.gold,padding:"1px 5px",letterSpacing:"0.1em"}}>LIVE</span></div>)}
        <div style={S.sbSecLbl}>Coming Soon</div>
        {MARKETS.filter(m=>!m.launch).map(m=><div key={m.id} style={{padding:"4px 18px 4px 24px",fontSize:"10px",color:"rgba(245,241,234,0.18)",display:"flex",alignItems:"center",gap:"6px"}}><span>{m.icon}</span><span>{m.label}</span></div>)}
      </div>
      <div style={{padding:"12px 18px",borderTop:`1px solid ${B.ruleN}`}}><div style={{fontSize:"8px",color:"rgba(245,241,234,0.18)",lineHeight:1.8}}>{state.sites.length} sites \u00b7 {state.dealMakers.length} deal makers<br/>{state.briefs.length} briefs</div></div>
    </div>

    <div style={S.main}>
      <div style={S.topbar}>
        <div style={S.topTitle}>{addingNew?"Score & Add New Site":titles[view]||view}</div>
        <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
          {isAdmin&&view==="pipeline"&&!addingNew&&<button style={S.btnG} onClick={()=>{setView("score");setAddingNew(true);}}>+ Score New Site</button>}
          {addingNew&&<button style={S.btnO} onClick={()=>{setAddingNew(false);setView("pipeline");}}>Cancel</button>}
          <UserSwitcher state={state} onSwitch={u=>setState(p=>({...p,currentUser:u}))}/>
        </div>
      </div>
      <div style={S.content}>
        {(view==="score"||addingNew)&&isAdmin&&<NewSiteFlow nextId={state.nextId} onSave={site=>{saveSite(site);setView("pipeline");setAddingNew(false);}} onCancel={()=>{setView("pipeline");setAddingNew(false);}}/>}
        {!addingNew&&view==="dashboard"&&<Dashboard sites={state.sites} dealMakers={state.dealMakers} briefs={state.briefs} currentUser={state.currentUser} onOpenSite={setSelectedSite}/>}
        {!addingNew&&view==="pipeline"&&<Pipeline sites={state.sites} dealMakers={state.dealMakers} currentUser={state.currentUser} onOpen={setSelectedSite} onAdd={()=>{setView("score");setAddingNew(true);}}/>}
        {!addingNew&&view==="marketplace"&&!isAdmin&&<Marketplace sites={state.sites} currentUser={state.currentUser} dealMakers={state.dealMakers} onClaim={claimSite} onOpen={setSelectedSite}/>}
        {!addingNew&&view==="briefs"&&<BuyerBriefs briefs={state.briefs} sites={state.sites} dealMakers={state.dealMakers} currentUser={state.currentUser} onSave={saveBrief} onDelete={deleteBrief}/>}
        {!addingNew&&view==="dealmakers"&&isAdmin&&<DealMakers dealMakers={state.dealMakers} sites={state.sites} onSave={saveDM} onDelete={deleteDM}/>}
      </div>
    </div>

    {selectedSite&&<SiteDrawer site={selectedSite} dealMakers={state.dealMakers} currentUser={state.currentUser} briefs={state.briefs} onSave={saveSite} onDelete={deleteSite} onClaim={claimSite} onUnclaim={unclaimSite} onClose={()=>setSelectedSite(null)}/>}
  </div>;
}
