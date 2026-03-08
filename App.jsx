import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { db } from './db';

const ADMINS = {
  bloomneo: { name: "Bruno", defLang: "en" },
  mogilda: { name: "Natalia", defLang: "de" },
  taurus: { name: "Felipe", defLang: "pt" },
};
const LANGS = [
  { code: "en", flag: "\u{1F1EC}\u{1F1E7}", name: "English" },
  { code: "pt", flag: "\u{1F1E7}\u{1F1F7}", name: "Portugu\u00eas" },
  { code: "de", flag: "\u{1F1E9}\u{1F1EA}", name: "Deutsch" },
];
const fB = function(v) { return "R$ " + (v || 0).toLocaleString("pt-BR"); };
const fG = function(v) { return "\u00a3" + (v || 0).toLocaleString("en-GB"); };
const fE = function(v) { return "\u20ac" + (v || 0).toLocaleString("de-DE"); };

const T = {
  en: {
    tagline:"A place for transformation", tracker:"Investment Tracker",
    adminBtn:"Enter as Admin", guestBtn:"Guest Access", pwPh:"Admin password",
    wrongPw:"Incorrect password.", welcome:"Welcome", synced:"Synced", exit:"\u2190 Exit",
    overview:"BLOOM OVERVIEW", totalInv:"Total Investment", buildSince:"Building since",
    months:"months", ownership:"Ownership",
    p1:"Phase 1", p1s:"Earth & Air", p2:"Phase 2", p2s:"Fire & Water",
    totalP1:"Total Phase 1", totalPaid:"Total Paid", totalOwed:"Total Owed",
    p1Break:"Phase 1 Breakdown", roots:"The Roots", rootsFE:"Foundation Equity",
    rootsQ:"Before there was a building, there was a dream. Before there was a dream, there was someone who believed.",
    rootsIntro:"In 2020, during the global pandemic, Bruno chose to stay in Brasil for 9 months.",
    rootsB:"Built a deep bond with Saramandala", rootsT:"Assembled the core team: Felipe, Jessica, Cesar",
    rootsV:"Developed the Bloom vision",
    rootsS:"Invested time, energy, and personal sacrifice \u2014 physical, mental, emotional and spiritual",
    rootsW:"This created the foundation that makes Bloom possible. Without it, there is no team, no land, no retreat, no dream to invest in.",
    rootsN:"When Natalia joined, she entered a project with a trusted team, a foundation retreat (Saramandala), and a solid dream already in the making.",
    rootsNone:"None of this existed before Bruno's investment of presence.",
    recognized:"Recognized", investedBy:"Invested by", period:"Period",
    land:"Land", arch:"Architecture", construction:"Construction", loanInt:"Loan Interest",
    stgFoundation:"Foundation", stgStructure:"Structure", stgElecPlumb:"Electrical & Plumbing", stgFinishing:"Finishing", stgLandscaping:"Landscaping",
    stgPlanning:"Planning", stgRenovation:"Renovation",
    paid:"Paid", active:"Active", owed:"Owed",
    settle:"Settlement Dashboard", constCost:"Construction Costs", howPaid:"How It Was Paid",
    whatOwe:"Financial Report", myPay:"Payments", proof:"Proof of Balance",
    oweFriend:"Cash Fund", constLabel:"Construction cost", covLoan:"Covered by loan",
    friendOwed:"Cash fund total", paidFriend:"Paid into cash fund", stillOwe:"Outstanding",
    loanCap:"Loan Capital", capRepaid:"Capital repaid", capRem:"Capital remaining",
    intCharged:"Interest charged", intPaid:"Interest paid", intRem:"Interest remaining",
    totalOwe:"Balance", maxOwe:"Maximum I could ever owe",
    owedTotal:"Outstanding Balance", constBal:"Construction Balance", allPay:"Payments",
    fundObl:"Financial Breakdown", fundAlloc:"Fund Allocation", loanIntCost:"Loan interest", totalObl:"Total", paidFund:"Paid into fund", allocConst:"Construction costs",
    loanCov:"Funded by loans", constSub:"Construction subtotal",
    viewDetails:"View details",
    settled:"Settled", overFunded:"Overfunded", phase1:"Phase 1", phase2:"Phase 2",
    totalFunded:"Total funded", balance:"Balance",
    completed:"Completed",
    never:"Never", loanInside:"is already inside construction cost. Adding them together counts the same money twice. Only interest is a legitimate extra cost.",
    totalP2:"Total Phase 2", totalPdIn:"Total Paid", remaining:"Remaining",
    p2Break:"Phase 2 Breakdown", mentor:"Mentorship",
    contribs:"Contributions", payments:"payments", combined:"Combined", remFund:"Remaining to fund",
    bruPay:"Bruno's Payments", natPay:"Natalia's Payments", funded:"Funded", fullyFunded:"Fully funded",
    ofTotal:"of total",
    mat:"Materials", labour:"Labour", mgmt:"Management", nutri:"Nutrition", extra:"Other",
    moneyIn:"Money Paid In", itemMgmt:"Item Management",
    newCat:"+ Add Category", newItem:"+ Add Item", newLoan:"+ Add Loan", newPay:"+ Add Payment",
    save:"Save", cancel:"Cancel", del:"Delete", confirm:"Are you sure you want to delete?",
    undoMsg:"deleted.", undo:"Undo", loanSec:"Loans",
    capital:"Capital", interest:"Interest", usedFor:"Used for",
    added:"Added!", saved:"Saved!", optional:"Optional", stageLabel:"STAGE", newStage:"+ Add New Stage", totalWord:"Total",
    capRepaidL:"Capital repaid", intRepaidL:"Interest repaid",
    dayPh:"Day", monthPh:"Month", untitled:"Untitled", delBtn:"Delete",
    aiN:"BLOOM Assistant", aiD:"AI-powered project management",
    aiP:"Ask anything about your project...", soon:"Coming soon...",
    name:"Name", price:"Price", notes:"Notes",
    editStage:"Edit Stage", editCat:"Edit Category", addCat:"Add Category",
    editItem:"Edit Item", addItem:"Add Item", editPay:"Edit Payment", addPay:"Add Payment",
    editLoan:"Edit Loan", addLoan:"Add Loan",
    colour:"Colour", startDate:"Start Date", endDate:"End Date", date:"Date", deleteQ:"Delete?", amount:"Amount",
    brunoHouse:"Bruno's House", indTrack:"Independent financial tracking",
    houseCosts:"Total House Costs", housePdIn:"Total Paid", houseRem:"Remaining",
    houseBreak:"Bruno's House Breakdown", housePay:"House Payments",
    rcTitle:"Running Costs", rcTotal:"Total Running Costs", rcPaid:"Total Paid",
    rcBalance:"Balance", rcBruno:"Bruno Paid", rcNatalia:"Natalia Paid",
    rcBrunoOwes:"Bruno owes Natalia", rcNataliaOwes:"Natalia owes Bruno", rcSettled:"Settled",
    rcBreak:"Running Costs Breakdown", newRcItem:"+ Add Item", addRcItem:"Add Item", editRcItem:"Edit Item",
    addRcPay:"Add Payment", editRcPay:"Edit Payment", rcLandTax:"Land Tax", rcWater:"Water", rcElec:"Electricity",
    rcItemFor:"Item covered", rcCostItems:"Cost Items", rcBruPay2:"Bruno's Payments", rcNatPay2:"Natalia's Payments",
    rcPending:"Pending", rcInternet:"Internet", rcGrassMow:"Grass Mowing", rcCleaning:"Cleaning", rcOthers:"Others", rcSettledTick:"Settled ✓", rcLeft:"left", rcPaidLower:"paid",
  },
  pt: {
    tagline:"Um lugar para a transforma\u00e7\u00e3o", tracker:"Rastreador de Investimentos",
    adminBtn:"Entrar como Admin", guestBtn:"Visitante", pwPh:"Senha do administrador",
    wrongPw:"Senha incorreta.", welcome:"Bem-Vindo", synced:"Sincronizado", exit:"\u2190 Sair",
    overview:"VIS\u00c3O GERAL BLOOM", totalInv:"Investimento Total", buildSince:"Construindo desde",
    months:"meses", ownership:"Participa\u00e7\u00e3o",
    p1:"Fase 1", p1s:"Terra & Ar", p2:"Fase 2", p2s:"Fogo & \u00c1gua",
    totalP1:"Total Fase 1", totalPaid:"Total Pago", totalOwed:"Total Devido",
    p1Break:"Detalhamento Fase 1", roots:"As Ra\u00edzes", rootsFE:"Equity de Funda\u00e7\u00e3o",
    rootsQ:"Antes de haver um edif\u00edcio, havia um sonho. Antes de haver um sonho, havia algu\u00e9m que acreditou.",
    rootsIntro:"Em 2020, durante a pandemia global, Bruno escolheu ficar no Brasil por 9 meses.",
    rootsB:"Construiu um v\u00ednculo profundo com Saramandala",
    rootsT:"Reuniu a equipa principal: Felipe, Jessica, Cesar",
    rootsV:"Desenvolveu a vis\u00e3o do Bloom",
    rootsS:"Investiu tempo, energia e sacrif\u00edcio pessoal \u2014 f\u00edsico, mental, emocional e espiritual",
    rootsW:"Isso criou a base que torna o Bloom poss\u00edvel. Sem isso, n\u00e3o h\u00e1 equipa, terreno, retiro ou sonho.",
    rootsN:"Quando Natalia entrou, encontrou um projeto com equipa de confian\u00e7a, retiro base e sonho s\u00f3lido.",
    rootsNone:"Nada disto existia antes do investimento de presen\u00e7a do Bruno.",
    recognized:"Reconhecido", investedBy:"Investido por", period:"Per\u00edodo",
    land:"Terreno", arch:"Arquitetura", construction:"Constru\u00e7\u00e3o", loanInt:"Juros do Empr\u00e9stimo",
    stgFoundation:"Funda\u00e7\u00e3o", stgStructure:"Estrutura", stgElecPlumb:"El\u00e9trica & Hidr\u00e1ulica", stgFinishing:"Acabamento", stgLandscaping:"Paisagismo",
    stgPlanning:"Planejamento", stgRenovation:"Reforma",
    paid:"Pago", active:"Ativo", owed:"Devido",
    settle:"Painel de Liquida\u00e7\u00e3o", constCost:"Custos de Constru\u00e7\u00e3o", howPaid:"Como Foi Pago",
    whatOwe:"Relat\u00f3rio Financeiro", myPay:"Pagamentos", proof:"Prova do Balan\u00e7o",
    oweFriend:"Fundo de Caixa", constLabel:"Custo da constru\u00e7\u00e3o", covLoan:"Coberto por empr\u00e9stimo",
    friendOwed:"Total do fundo", paidFriend:"Pago ao fundo", stillOwe:"Pendente",
    loanCap:"Capital do Empr\u00e9stimo", capRepaid:"Capital pago", capRem:"Capital restante",
    intCharged:"Juros cobrados", intPaid:"Juros pagos", intRem:"Juros restantes",
    totalOwe:"Saldo", maxOwe:"M\u00e1ximo que posso dever",
    owedTotal:"Saldo Pendente", constBal:"Saldo da Constru\u00e7\u00e3o", allPay:"Pagamentos",
    fundObl:"Detalhamento Financeiro", fundAlloc:"Distribui\u00e7\u00e3o do Fundo", loanIntCost:"Juros do empr\u00e9stimo", totalObl:"Total", paidFund:"Pago ao fundo", allocConst:"Custos de constru\u00e7\u00e3o",
    loanCov:"Financiado por empr\u00e9stimos", constSub:"Subtotal da constru\u00e7\u00e3o",
    viewDetails:"Ver detalhes",
    settled:"Quitado", overFunded:"Sobrefinanciado", phase1:"Fase 1", phase2:"Fase 2",
    totalFunded:"Total financiado", balance:"Saldo",
    completed:"Conclu\u00eddo",
    never:"Nunca", loanInside:"j\u00e1 est\u00e1 dentro do custo de constru\u00e7\u00e3o. Som\u00e1-los conta o mesmo dinheiro duas vezes.",
    totalP2:"Total Fase 2", totalPdIn:"Total Pago", remaining:"Restante",
    p2Break:"Detalhamento Fase 2", mentor:"Mentoria",
    contribs:"Contribui\u00e7\u00f5es", payments:"pagamentos", combined:"Combinado", remFund:"Restante a financiar",
    bruPay:"Pagamentos do Bruno", natPay:"Pagamentos da Natalia", funded:"Financiado", fullyFunded:"Totalmente financiado",
    ofTotal:"do total",
    mat:"Materiais", labour:"M\u00e3o de Obra", mgmt:"Gest\u00e3o", nutri:"Nutri\u00e7\u00e3o", extra:"Outros",
    moneyIn:"Dinheiro Pago", itemMgmt:"Gest\u00e3o de Itens",
    newCat:"+ Nova Categoria", newItem:"+ Novo Item", newLoan:"+ Novo Empr\u00e9stimo", newPay:"+ Novo Pagamento",
    save:"Salvar", cancel:"Cancelar", del:"Excluir", confirm:"Tem certeza que deseja excluir?",
    undoMsg:"exclu\u00eddo.", undo:"Desfazer", loanSec:"Empr\u00e9stimos",
    capital:"Capital", interest:"Juros", usedFor:"Usado para",
    added:"Adicionado!", saved:"Salvo!", optional:"Opcional", stageLabel:"ETAPA", newStage:"+ Nova Etapa", totalWord:"Total",
    capRepaidL:"Capital pago", intRepaidL:"Juros pagos",
    dayPh:"Dia", monthPh:"M\u00eas", untitled:"Sem t\u00edtulo", delBtn:"Excluir",
    aiN:"Assistente BLOOM", aiD:"Gest\u00e3o de projeto com IA",
    aiP:"Pergunte qualquer coisa...", soon:"Em breve...",
    name:"Nome", price:"Pre\u00e7o", notes:"Notas",
    editStage:"Editar Etapa", editCat:"Editar Categoria", addCat:"Adicionar Categoria",
    editItem:"Editar Item", addItem:"Adicionar Item", editPay:"Editar Pagamento", addPay:"Adicionar Pagamento",
    editLoan:"Editar Empr\u00e9stimo", addLoan:"Adicionar Empr\u00e9stimo",
    colour:"Cor", startDate:"Data In\u00edcio", endDate:"Data Fim", date:"Data", deleteQ:"Excluir?", amount:"Valor",
    brunoHouse:"Casa do Bruno", indTrack:"Acompanhamento financeiro independente",
    houseCosts:"Custo Total da Casa", housePdIn:"Total Pago", houseRem:"Restante",
    houseBreak:"Detalhamento Casa do Bruno", housePay:"Pagamentos da Casa",
    rcTitle:"Custos Operacionais", rcTotal:"Total Custos", rcPaid:"Total Pago",
    rcBalance:"Saldo", rcBruno:"Bruno Pagou", rcNatalia:"Natalia Pagou",
    rcBrunoOwes:"Bruno deve Natalia", rcNataliaOwes:"Natalia deve Bruno", rcSettled:"Quitado",
    rcBreak:"Detalhamento Custos", newRcItem:"+ Novo Item", addRcItem:"Novo Item", editRcItem:"Editar Item",
    addRcPay:"Adicionar Pagamento", editRcPay:"Editar Pagamento", rcLandTax:"IPTU", rcWater:"\u00c1gua", rcElec:"Eletricidade",
    rcItemFor:"Item coberto", rcCostItems:"Itens de Custo", rcBruPay2:"Pagamentos Bruno", rcNatPay2:"Pagamentos Natalia",
    rcPending:"Pendente", rcInternet:"Internet", rcGrassMow:"Corte de Grama", rcCleaning:"Limpeza", rcOthers:"Outros", rcSettledTick:"Quitado ✓", rcLeft:"restante", rcPaidLower:"pago",
  },
  de: {
    tagline:"Ein Ort f\u00fcr Transformation", tracker:"Investment-Tracker",
    adminBtn:"Als Admin anmelden", guestBtn:"Gastzugang", pwPh:"Admin-Passwort",
    wrongPw:"Falsches Passwort.", welcome:"Willkommen", synced:"Synchronisiert", exit:"\u2190 Beenden",
    overview:"BLOOM \u00dcBERSICHT", totalInv:"Gesamtinvestition", buildSince:"Im Bau seit",
    months:"Monate", ownership:"Beteiligung",
    p1:"Phase 1", p1s:"Erde & Luft", p2:"Phase 2", p2s:"Feuer & Wasser",
    totalP1:"Gesamt Phase 1", totalPaid:"Gesamt Bezahlt", totalOwed:"Gesamt Geschuldet",
    p1Break:"Phase 1 Aufschl\u00fcsselung", roots:"Die Wurzeln", rootsFE:"Gr\u00fcndungskapital",
    rootsQ:"Bevor es ein Geb\u00e4ude gab, gab es einen Traum. Bevor es einen Traum gab, gab es jemanden, der glaubte.",
    rootsIntro:"2020, w\u00e4hrend der Pandemie, blieb Bruno 9 Monate in Brasilien.",
    rootsB:"Baute tiefe Verbindung mit Saramandala auf",
    rootsT:"Stellte Kernteam zusammen: Felipe, Jessica, Cesar",
    rootsV:"Entwickelte die Bloom-Vision",
    rootsS:"Investierte Zeit, Energie und Opfer \u2014 physisch, mental, emotional, spirituell",
    rootsW:"Dies schuf die Grundlage f\u00fcr Bloom. Ohne sie gibt es kein Team, kein Land, kein Retreat.",
    rootsN:"Als Natalia dazukam, fand sie ein Projekt mit vertrauensw\u00fcrdigem Team und solidem Traum.",
    rootsNone:"Nichts davon existierte vor Brunos Investment an Pr\u00e4senz.",
    recognized:"Anerkannt", investedBy:"Investiert von", period:"Zeitraum",
    land:"Grundst\u00fcck", arch:"Architektur", construction:"Konstruktion", loanInt:"Darlehenszinsen",
    stgFoundation:"Fundament", stgStructure:"Rohbau", stgElecPlumb:"Elektrik & Sanit\u00e4r", stgFinishing:"Innenausbau", stgLandscaping:"Landschaftsbau",
    stgPlanning:"Planung", stgRenovation:"Renovierung",
    paid:"Bezahlt", active:"Aktiv", owed:"Geschuldet",
    settle:"Abrechnungs-Dashboard", constCost:"Baukosten", howPaid:"Wie bezahlt",
    whatOwe:"Finanzbericht", myPay:"Zahlungen", proof:"Bilanzbeweis",
    oweFriend:"Barfonds", constLabel:"Baukosten", covLoan:"Durch Darlehen gedeckt",
    friendOwed:"Barfonds gesamt", paidFriend:"In Barfonds eingezahlt", stillOwe:"Ausstehend",
    loanCap:"Darlehenskapital", capRepaid:"Kapital zur\u00fcckgezahlt", capRem:"Kapital verbleibend",
    intCharged:"Berechnete Zinsen", intPaid:"Zinsen bezahlt", intRem:"Zinsen verbleibend",
    totalOwe:"Saldo", maxOwe:"Maximum Schulden",
    owedTotal:"Ausstehender Saldo", constBal:"Bausaldo", allPay:"Zahlungen",
    fundObl:"Finanzaufschl\u00fcsselung", fundAlloc:"Fondsverteilung", loanIntCost:"Darlehenszinsen", totalObl:"Gesamt", paidFund:"In Fonds eingezahlt", allocConst:"Baukosten",
    loanCov:"Durch Darlehen finanziert", constSub:"Bau-Zwischensumme",
    viewDetails:"Details anzeigen",
    settled:"Beglichen", overFunded:"\u00dcberfinanziert", phase1:"Phase 1", phase2:"Phase 2",
    totalFunded:"Gesamt finanziert", balance:"Saldo",
    completed:"Abgeschlossen",
    never:"Niemals", loanInside:"ist bereits in Baukosten enthalten. Beides zusammen z\u00e4hlt doppelt.",
    totalP2:"Gesamt Phase 2", totalPdIn:"Gesamt Bezahlt", remaining:"Verbleibend",
    p2Break:"Phase 2 Aufschl\u00fcsselung", mentor:"Mentoring",
    contribs:"Beitr\u00e4ge", payments:"Zahlungen", combined:"Kombiniert", remFund:"Noch zu finanzieren",
    bruPay:"Brunos Zahlungen", natPay:"Natalias Zahlungen", funded:"Finanziert", fullyFunded:"Vollst\u00e4ndig finanziert",
    ofTotal:"vom Gesamt",
    mat:"Materialien", labour:"Arbeit", mgmt:"Verwaltung", nutri:"Verpflegung", extra:"Sonstiges",
    moneyIn:"Eingezahltes Geld", itemMgmt:"Postenverwaltung",
    newCat:"+ Neue Kategorie", newItem:"+ Neuer Posten", newLoan:"+ Neues Darlehen", newPay:"+ Neue Zahlung",
    save:"Speichern", cancel:"Abbrechen", del:"L\u00f6schen", confirm:"M\u00f6chten Sie das wirklich l\u00f6schen?",
    undoMsg:"gel\u00f6scht.", undo:"R\u00fcckg\u00e4ngig", loanSec:"Darlehen",
    capital:"Kapital", interest:"Zinsen", usedFor:"Verwendet f\u00fcr",
    added:"Hinzugef\u00fcgt!", saved:"Gespeichert!", optional:"Optional", stageLabel:"STUFE", newStage:"+ Neue Stufe", totalWord:"Gesamt",
    capRepaidL:"Kapital zur\u00fcckgezahlt", intRepaidL:"Zinsen zur\u00fcckgezahlt",
    dayPh:"Tag", monthPh:"Monat", untitled:"Unbenannt", delBtn:"L\u00f6schen",
    aiN:"BLOOM Assistent", aiD:"KI-gest\u00fctzte Projektverwaltung",
    aiP:"Fragen Sie etwas...", soon:"Demn\u00e4chst...",
    name:"Name", price:"Preis", notes:"Notizen",
    editStage:"Etappe Bearbeiten", editCat:"Kategorie Bearbeiten", addCat:"Kategorie Hinzuf\u00fcgen",
    editItem:"Posten Bearbeiten", addItem:"Posten Hinzuf\u00fcgen", editPay:"Zahlung Bearbeiten", addPay:"Zahlung Hinzuf\u00fcgen",
    editLoan:"Darlehen Bearbeiten", addLoan:"Darlehen Hinzuf\u00fcgen",
    colour:"Farbe", startDate:"Startdatum", endDate:"Enddatum", date:"Datum", deleteQ:"L\u00f6schen?", amount:"Betrag",
    brunoHouse:"Bruno Haus", indTrack:"Unabh\u00e4ngige Finanzverfolgung",
    houseCosts:"Gesamte Hauskosten", housePdIn:"Gesamt Bezahlt", houseRem:"Verbleibend",
    houseBreak:"Bruno Haus Aufschl\u00fcsselung", housePay:"Hauszahlungen",
    rcTitle:"Laufende Kosten", rcTotal:"Gesamte Kosten", rcPaid:"Gesamt Bezahlt",
    rcBalance:"Saldo", rcBruno:"Bruno Bezahlt", rcNatalia:"Natalia Bezahlt",
    rcBrunoOwes:"Bruno schuldet Natalia", rcNataliaOwes:"Natalia schuldet Bruno", rcSettled:"Ausgeglichen",
    rcBreak:"Kostenaufschl\u00fcsselung", newRcItem:"+ Eintrag Hinzuf\u00fcgen", addRcItem:"Eintrag Hinzuf\u00fcgen", editRcItem:"Eintrag Bearbeiten",
    addRcPay:"Zahlung Hinzuf\u00fcgen", editRcPay:"Zahlung Bearbeiten", rcLandTax:"Grundsteuer", rcWater:"Wasser", rcElec:"Strom",
    rcItemFor:"Betroffener Posten", rcCostItems:"Kostenpositionen", rcBruPay2:"Bruno Zahlungen", rcNatPay2:"Natalia Zahlungen",
    rcPending:"Ausstehend", rcInternet:"Internet", rcGrassMow:"Rasenpflege", rcCleaning:"Reinigung", rcOthers:"Sonstiges", rcSettledTick:"Beglichen ✓", rcLeft:"übrig", rcPaidLower:"bezahlt",
  },
};

// ═══ DATA ═══
var CK = ["mat","labour","mgmt","nutri","extra"];
var CC = ["#E67E22","#27AE60","#2980B9","#8E44AD","#95A5A6"];
// ═══ DEFAULT DATA (initial values, overridden by localStorage) ═══
var _mk = function(total,totalG,sp){return sp.map(function(s){return {t:s[0],t_pt:s[1],t_de:s[2],b:Math.round(total*s[3]),g:totalG?Math.round(totalG*s[3]):undefined};});};
var P1_ITEMS_INIT = [
  _mk(142000,25276,[ ["Cement & concrete","Cimento e concreto","Zement und Beton",0.32],["Steel & rebar","Aço e vergalhão","Stahl und Bewehrung",0.25],["Bricks & blocks","Tijolos e blocos","Ziegel und Blöcke",0.21],["Sand & gravel","Areia e cascalho","Sand und Kies",0.13],["Waterproofing","Impermeabilização","Abdichtung",0.09] ]),
  _mk(98000,17444,[ ["Mason team","Equipe de pedreiros","Maurerteam",0.43],["General labour","Mão de obra geral","Allgemeine Arbeit",0.29],["Plumber","Encanador","Klempner",0.16],["Electrician","Eletricista","Elektriker",0.12] ]),
  _mk(35000,6230,[ ["Wiring & panels","Fiação e painéis","Verkabelung und Verteiler",0.51],["Pipes & fittings","Tubos e conexões","Rohre und Armaturen",0.34],["Fixtures","Acabamentos","Armaturen",0.15] ]),
  _mk(18000,3204,[ ["Tiles","Azulejos","Fliesen",0.44],["Paint & coating","Tinta e revestimento","Farbe und Beschichtung",0.33],["Hardware","Ferragens","Beschläge",0.23] ]),
  _mk(22000,3916,[ ["Garden & planting","Jardim e plantio","Garten und Bepflanzung",0.55],["Fencing","Cercas","Zäune",0.27],["Drainage","Drenagem","Entwässerung",0.18] ])
];
var P2_ITEMS_INIT = [
  [_mk(20800,3702,[ ["Foundation concrete","Concreto da fundação","Fundamentbeton",0.58],["Foundation steel","Aço da fundação","Fundamentstahl",0.42] ]),
   _mk(14560,2592,[ ["Excavation crew","Equipe de escavação","Aushubmannschaft",0.55],["Foundation workers","Trabalhadores da fundação","Fundamentarbeiter",0.45] ]),
   _mk(6240,1111,[ ["Underground conduit","Conduíte subterrâneo","Unterirdische Leitungen",0.60],["Foundation drainage","Drenagem da fundação","Fundamententwässerung",0.40] ]),
   _mk(4160,740,[ ["Foundation sealing","Selagem da fundação","Fundamentversiegelung",1.0] ]),
   _mk(6240,1111,[ ["Site clearing","Limpeza do terreno","Geländeräumung",0.60],["Soil prep","Preparo do solo","Bodenvorbereitung",0.40] ])],
  [_mk(34000,6052,[ ["Structural steel","Aço estrutural","Baustahl",0.41],["Blocks & mortar","Blocos e argamassa","Blöcke und Mörtel",0.35],["Roof timber","Madeira do telhado","Dachholz",0.24] ]),
   _mk(23800,4234,[ ["Structural masons","Pedreiros estruturais","Strukturmaurer",0.58],["Roof crew","Equipe do telhado","Dachmannschaft",0.42] ]),
   _mk(10200,1816,[ ["Rough-in electrical","Instalação elétrica bruta","Elektro-Rohinstallation",0.55],["Conduit runs","Passagens de conduíte","Leitungsführungen",0.45] ]),
   _mk(6800,1210,[ ["Frame sealing","Selagem da estrutura","Rahmenabdichtung",0.60],["Scaffolding rental","Aluguel de andaimes","Gerüstmiete",0.40] ]),
   _mk(10200,1816,[ ["Site grading","Nivelamento do terreno","Geländenivellierung",0.55],["Debris removal","Remoção de entulho","Schuttbeseitigung",0.45] ])],
  [_mk(31200,5554,[ ["Wire & cable","Fios e cabos","Drähte und Kabel",0.40],["Pipe fittings","Conexões de tubos","Rohranschlüsse",0.35],["Panel boards","Quadros de distribuição","Verteilertafeln",0.25] ]),
   _mk(21840,3886,[ ["Electricians","Eletricistas","Elektriker",0.54],["Plumbers","Encanadores","Klempner",0.46] ]),
   _mk(9360,1666,[ ["Light fixtures","Luminárias","Leuchten",0.50],["Outlets & switches","Tomadas e interruptores","Steckdosen und Schalter",0.50] ]),
   _mk(6240,1111,[ ["Wall patching","Reparo de paredes","Wandreparatur",0.55],["Sealant work","Trabalho de vedação","Abdichtungsarbeiten",0.45] ]),
   _mk(9360,1666,[ ["Outdoor lighting","Iluminação externa","Außenbeleuchtung",0.55],["Pathway prep","Preparação de caminhos","Wegvorbereitung",0.45] ])],
  [_mk(39400,7013,[ ["Tiles & stone","Azulejos e pedras","Fliesen und Stein",0.38],["Paint supplies","Materiais de pintura","Malerbedarf",0.32],["Wood trim","Acabamento em madeira","Holzleisten",0.30] ]),
   _mk(27580,4909,[ ["Tile installers","Instaladores de azulejos","Fliesenleger",0.40],["Painters","Pintores","Maler",0.35],["Carpenters","Carpinteiros","Schreiner",0.25] ]),
   _mk(11820,2104,[ ["Smart fixtures","Acabamentos inteligentes","Smarte Armaturen",0.55],["Final switches","Interruptores finais","Endschalter",0.45] ]),
   _mk(7880,1403,[ ["Polish & seal","Polimento e selagem","Politur und Versiegelung",0.55],["Touch-ups","Retoques","Nachbesserungen",0.45] ]),
   _mk(11820,2104,[ ["Deck materials","Materiais do deck","Terrassenmaterial",0.60],["Entrance work","Trabalho de entrada","Eingangsarbeiten",0.40] ])],
  [_mk(24400,4343,[ ["Plants & soil","Plantas e solo","Pflanzen und Erde",0.45],["Stone pavers","Pedras de pavimentação","Steinpflaster",0.35],["Irrigation parts","Peças de irrigação","Bewässerungsteile",0.20] ]),
   _mk(17080,3040,[ ["Garden crew","Equipe de jardinagem","Gartenmannschaft",0.55],["Pavers team","Equipe de pavimentação","Pflasterteam",0.45] ]),
   _mk(7320,1303,[ ["Outdoor lighting","Iluminação externa","Außenbeleuchtung",0.55],["Irrigation electric","Elétrica de irrigação","Bewässerungselektrik",0.45] ]),
   _mk(4880,869,[ ["Entrance finish","Acabamento da entrada","Eingangsfinish",0.55],["Final details","Detalhes finais","Letzte Details",0.45] ]),
   _mk(7320,1303,[ ["Planting","Plantio","Bepflanzung",0.55],["Turf laying","Colocação de grama","Rasenverlegung",0.45] ])]
];
var H_ITEMS_INIT = [
  [_mk(6000,0,[ ["Design plans","Projetos de design","Entwurfspläne",0.60],["Permits","Licenças","Genehmigungen",0.40] ]),
   _mk(4200,0,[ ["Consultant","Consultor","Berater",0.55],["Surveyor","Topógrafo","Vermesser",0.45] ]),
   _mk(1800,0,[ ["Electrical assessment","Avaliação elétrica","Elektrische Bewertung",1.0] ]),
   _mk(1200,0,[ ["Inspection fees","Taxas de inspeção","Inspektionsgebühren",1.0] ]),
   _mk(1800,0,[ ["Tree removal","Remoção de árvores","Baumfällung",1.0] ])],
  [_mk(18000,0,[ ["Renovation cement","Cimento de reforma","Renovierungszement",0.45],["Renovation timber","Madeira de reforma","Renovierungsholz",0.35],["Fixtures","Acabamentos","Armaturen",0.20] ]),
   _mk(12600,0,[ ["Builder team","Equipe de construção","Bauteam",0.55],["Helper labour","Mão de obra auxiliar","Hilfskräfte",0.45] ]),
   _mk(5400,0,[ ["New wiring","Nova fiação","Neue Verkabelung",0.55],["New plumbing","Nova hidráulica","Neue Sanitär",0.45] ]),
   _mk(3600,0,[ ["Interior finish","Acabamento interno","Innenausbau",0.55],["Paint","Pintura","Anstrich",0.45] ]),
   _mk(5400,0,[ ["Garden rework","Reforma do jardim","Gartenumbau",0.55],["Fencing","Cercas","Zäune",0.45] ])]
];
var ROOTS=1000000, ROOTSG=178000;
var LAND_ITEMS_INIT=[{t:"Land purchase",t_pt:"Compra do terreno",t_de:"Grundstückskauf",b:185000,g:32930},{t:"Registry Document",t_pt:"Escritura",t_de:"Grundbucheintrag",b:3200,g:570,date:"12/03/2024",attachments:[{name:"Registry Document - Land - 12-03-2024.pdf",url:"https://res.cloudinary.com/dhjsldh2q/image/upload/v1/BLOOM/Registry%20Document%20-%20Land%20-%2012-03-2024.pdf"}]}];
var ARCH_ITEMS_INIT=[{t:"Architectural project",t_pt:"Projeto arquitetônico",t_de:"Architekturprojekt",b:35000,g:6230},{t:"Engineering plans",t_pt:"Projetos de engenharia",t_de:"Ingenieurpläne",b:7000,g:1246}];
var LOANS_INIT = [
  {t:"Loan #1",t_pt:"Empréstimo #1",t_de:"Darlehen #1",a:30000,ag:5340,i:3500,ig:623,use:"Materials & Plumbing",use_pt:"Materiais e Hidráulica",use_de:"Materialien und Sanitär",cp:8000,cpg:1424,ip:2000,ipg:356},
  {t:"Loan #2",t_pt:"Empréstimo #2",t_de:"Darlehen #2",a:10000,ag:1780,i:1500,ig:267,use:"Labour",use_pt:"Mão de obra",use_de:"Arbeitskräfte",cp:0,cpg:0,ip:0,ipg:0}
];
var P1PAY_INIT=[{t:"Transfer Mar 2026",t_pt:"Transferência Mar 2026",t_de:"Überweisung Mär 2026",b:120000,g:21360},{t:"Transfer Jan 2026",t_pt:"Transferência Jan 2026",t_de:"Überweisung Jan 2026",b:80000,g:14240}];
var MENT_INIT=[{t:"Session package",t_pt:"Pacote de sessões",t_de:"Sitzungspaket",b:8000},{t:"Travel costs",t_pt:"Custos de viagem",t_de:"Reisekosten",b:4500},{t:"Materials",t_pt:"Materiais",t_de:"Materialien",b:2500}];
var STAGE_COLORS=["#D4A574","#C4854A","#A8642A","#8B4513","#5C2D0E"];
var P2_META_INIT=[
  {t:"Foundation",t_pt:"Fundação",t_de:"Fundament",color:"#D4A574"},
  {t:"Structure",t_pt:"Estrutura",t_de:"Rohbau",color:"#C4854A"},
  {t:"Electrical & Plumbing",t_pt:"Elétrica & Hidráulica",t_de:"Elektrik & Sanitär",color:"#A8642A"},
  {t:"Finishing",t_pt:"Acabamento",t_de:"Innenausbau",color:"#8B4513"},
  {t:"Landscaping",t_pt:"Paisagismo",t_de:"Landschaftsbau",color:"#5C2D0E"}
];
var BRU2_INIT=[{t:"Bruno Mar 2026",t_pt:"Bruno Mar 2026",t_de:"Bruno Mär 2026",b:120000,g:21360},{t:"Bruno Jan 2026",t_pt:"Bruno Jan 2026",t_de:"Bruno Jan 2026",b:78000,g:13884}];
var NAT2_INIT=[{t:"Natalia Feb 2026",t_pt:"Natalia Fev 2026",t_de:"Natalia Feb 2026",b:95000,e:16625},{t:"Natalia Dec 2025",t_pt:"Natalia Dez 2025",t_de:"Natalia Dez 2025",b:103000,e:18025}];
var H_META_INIT=[
  {t:"Planning",t_pt:"Planejamento",t_de:"Planung",color:"#8E44AD"},
  {t:"Renovation",t_pt:"Reforma",t_de:"Renovierung",color:"#2980B9"}
];
var H_STAGE_COLORS=["#8E44AD","#2980B9"];
var H_PAY_INIT=[{t:"Bruno's House Jan 2026",t_pt:"Casa do Bruno Jan 2026",t_de:"Bruno Haus Jan 2026",b:30000,g:5340}];

var F1="'Cormorant Garamond',serif";
var F2="'DM Sans',sans-serif";
var GRAD="linear-gradient(170deg, #62300F 0%, #4A2209 50%, #3D1A06 100%)";
var CSS="@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}";

var COLOR_OPTIONS=["#C0392B","#E67E22","#F1C40F","#27AE60","#1ABC9C","#3498DB","#8E44AD","#C9A84C","#62300F","#2C3E50"];

var LS_KEY = "bloom_data";
var _lsCache = null;
var _currentAdmin = null; // set on login, cleared on logout — used by _saveLS for Supabase writes

var _loadLS = function() {
  if (_lsCache) return _lsCache;
  try { _lsCache = JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch(e) { _lsCache = {}; }
  return _lsCache;
};
var _saveLS = function(updates) {
  try {
    var m = _loadLS();
    for (var k in updates) m[k] = updates[k];
    _lsCache = m;
    localStorage.setItem(LS_KEY, JSON.stringify(m));
    // Fire-and-forget Supabase sync (localStorage stays as fast local cache)
    var adminName = _currentAdmin || 'system';
    Object.keys(updates).forEach(function(key) {
      db.saveState(key, updates[key], adminName).catch(function(e) {
        console.warn('[BLOOM] Cloud sync failed for', key, e);
      });
    });
  } catch(e) {}
};
var _cloneDeep = function(a) { return JSON.parse(JSON.stringify(a)); };
var _sumB = function(arr){return arr.reduce(function(s,it){return s+(it.b||0);},0);};
var _sumG = function(arr){return arr.reduce(function(s,it){return s+(it.g||0);},0);};
var _mergeTl = function(target, tlObj) { for (var k in tlObj) target[k] = tlObj[k]; return target; };


function SwipeRow(props) {
  var ch = props.children; var onDel = props.onDelete; var nm = props.itemName || "Item"; var ok = props.enabled !== false; var delLabel = props.deleteLabel || "Delete";
  var _off = useState(0); var offset = _off[0]; var setOff = _off[1];
  var _sd = useState(false); var showD = _sd[0]; var setShowD = _sd[1];
  var drag = useRef(false); var sX = useRef(0); var oR = useRef(0);
  if (!ok) return ch;
  var onS = function(x) { sX.current = x; drag.current = true; };
  var onM = function(x) { if (!drag.current) return; var d = x - sX.current; if (d < -15) { var v = Math.max(d, -80); setOff(v); oR.current = v; if (d < -40) setShowD(true); } else { setOff(0); oR.current = 0; setShowD(false); } };
  var onE = function() { drag.current = false; if (oR.current > -40) { setOff(0); oR.current = 0; setShowD(false); } else { setOff(-80); oR.current = -80; } };
  var rst = function() { setOff(0); oR.current = 0; setShowD(false); };
  return (
    <div style={{position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",right:0,top:0,bottom:0,width:80,background:"#E74C3C",display:"flex",alignItems:"center",justifyContent:"center",opacity:showD?1:0,transition:"opacity 0.15s"}}>
        <button onClick={function(){rst();if(onDel)onDel();}} style={{background:"none",border:"none",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",letterSpacing:1,textTransform:"uppercase"}}>{delLabel}</button>
      </div>
      <div onMouseDown={function(e){e.preventDefault();onS(e.clientX);}} onMouseMove={function(e){if(drag.current)onM(e.clientX);}} onMouseUp={onE} onMouseLeave={function(){if(drag.current)onE();}} onTouchStart={function(e){onS(e.touches[0].clientX);}} onTouchMove={function(e){onM(e.touches[0].clientX);}} onTouchEnd={onE} style={{transform:"translateX("+offset+"px)",transition:drag.current?"none":"transform 0.2s ease",position:"relative",zIndex:1,background:"inherit"}}>{ch}</div>
    </div>
  );
}

var DAYS = []; for (var _di=1;_di<=31;_di++) DAYS.push(_di<10?"0"+_di:String(_di));
var MONTHS = ["01","02","03","04","05","06","07","08","09","10","11","12"];
var MONTH_NAMES = {en:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],pt:["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],de:["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"]};
var BUILD_START = new Date(2025, 2, 1); // March 2025
var YEARS = ["2023","2024","2025","2026","2027","2028"];

function TlBar(props) {
  var seg=props.seg, lft=props.lft, wid=props.wid, isAct=props.isAct;
  var showLabel = wid > 8;
  return (
    <div style={{position:"absolute",left:lft+"%",width:wid+"%",height:"100%",borderRadius:isAct?"4px 0 0 4px":"4px",background:seg.color,opacity:0.85,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",minWidth:2}}>
      {showLabel && <span style={{fontSize:8,color:"#fff",fontWeight:600,letterSpacing:0.5,whiteSpace:"nowrap",paddingLeft:4,paddingRight:4,overflow:"hidden",textOverflow:"ellipsis"}}>{seg.label}</span>}
      {isAct && <div style={{position:"absolute",right:0,top:0,bottom:0,width:3,borderRight:"2px dashed rgba(255,255,255,0.8)"}} />}
    </div>
  );
}
function TlGanttGroup(props) {
  var segs=props.segs, groupLabel=props.groupLabel, isA=props.isA;
  var tlParseD=props.tlParseD, tlParseEndD=props.tlParseEndD, tlToPct=props.tlToPct;
  var tlTodayPct=props.tlTodayPct, TL_TODAY=props.TL_TODAY;
  var lpStart=props.lpStart, lpMove=props.lpMove, lpEnd=props.lpEnd;
  var tlAxisMonths=props.tlAxisMonths;
  var STICKY_LABEL = {width:62,flexShrink:0,position:"sticky",left:0,zIndex:3,background:"#fff",fontSize:9,color:"#9A9A9A",textAlign:"right",paddingRight:6,letterSpacing:0.5,alignSelf:"stretch",display:"flex",alignItems:"center",justifyContent:"flex-end"};
  return (
    <div style={{marginBottom:16}}>
      <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"#9A9A9A",marginBottom:8,paddingLeft:4,position:"sticky",left:0,zIndex:3,background:"#fff",width:62}}>{groupLabel}</div>
      {segs.map(function(seg,i){
        var sd2=tlParseD(seg.startDate); var hasStart=!!sd2; var isAct=hasStart&&!seg.endDate;
        var ed2=hasStart?(seg.endDate?tlParseEndD(seg.endDate):TL_TODAY):null;
        var lft=hasStart?tlToPct(sd2):0; var wid=hasStart?Math.max(1,tlToPct(ed2)-tlToPct(sd2)):100;
        var ph=seg.phase; var idx=seg.idx;
        var lpH=isA?function(e){lpStart("editStage",{name:seg.name,color:seg.color,startDate:seg.startDate||"",endDate:seg.endDate||""},e,{phase:ph==="p2"?"p2":ph==="house"?"house":"p1meta",idx:idx});}:undefined;
        return (
          <div key={i} onMouseDown={lpH} onMouseMove={isA?lpMove:undefined} onMouseUp={isA?lpEnd:undefined} onMouseLeave={isA?lpEnd:undefined} onTouchStart={lpH} onTouchMove={isA?lpMove:undefined} onTouchEnd={isA?lpEnd:undefined} style={{display:"flex",alignItems:"center",marginBottom:6,gap:4,cursor:isA?"pointer":"default"}}>
            <div style={STICKY_LABEL}>{seg.label}</div>
            <div style={{flex:1,height:22,position:"relative",borderRadius:4,background:"rgba(128,66,24,0.04)"}}>
              {tlAxisMonths.map(function(mo,mi){
                var pct=tlToPct(mo);
                var isJan=mo.getMonth()===0;
                return <div key={mi} style={{position:"absolute",left:pct+"%",top:0,bottom:0,width:"1px",background:isJan?"rgba(128,66,24,0.18)":"rgba(128,66,24,0.07)",zIndex:0,pointerEvents:"none"}} />;
              })}
              {hasStart && <TlBar seg={seg} lft={lft} wid={wid} isAct={isAct} />}
              {!hasStart && <div style={{position:"absolute",left:0,right:0,top:2,bottom:2,borderRadius:4,border:"1.5px dashed "+seg.color,opacity:0.35,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:8,color:seg.color,opacity:0.7,letterSpacing:0.5}}>no dates set</span></div>}
              <div style={{position:"absolute",left:tlTodayPct+"%",top:0,bottom:0,width:1.5,background:"rgba(192,57,43,0.7)",zIndex:2,pointerEvents:"none"}} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
function TlAxis(props) {
  var tlToPct=props.tlToPct, tlTodayPct=props.tlTodayPct;
  var LABEL_W = 62;
  var FIXED_YEARS = [2023,2024,2025,2026,2027];
  var yearBlocks = FIXED_YEARS.map(function(y,i){
    return {year:y, left:tlToPct(new Date(y,0,1)), width:tlToPct(new Date(y+1,0,1))-tlToPct(new Date(y,0,1)), i:i};
  });
  var allMonths = [];
  for(var ym=2023;ym<=2027;ym++){
    for(var mm=0;mm<12;mm++) allMonths.push(new Date(ym,mm,1));
  }
  var stickyGutter = {width:LABEL_W,flexShrink:0,position:"sticky",left:0,zIndex:3,background:"#fff"};
  return (
    <div style={{marginBottom:6}}>
      <div style={{display:"flex",alignItems:"stretch",marginBottom:3,height:16}}>
        <div style={stickyGutter} />
        <div style={{flex:1,position:"relative"}}>
          {yearBlocks.map(function(yb){
            var YR_COLORS = ["rgba(98,48,15,0.10)","rgba(98,48,15,0.06)"];
            return (
              <div key={yb.year} style={{position:"absolute",left:yb.left+"%",width:yb.width+"%",height:"100%",background:YR_COLORS[yb.i%2],borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",boxSizing:"border-box",border:"1px solid rgba(98,48,15,0.08)"}}>
                <span style={{fontSize:9,fontWeight:600,color:"rgba(98,48,15,0.55)",letterSpacing:1,whiteSpace:"nowrap"}}>{yb.year}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"stretch",height:14}}>
        <div style={stickyGutter} />
        <div style={{flex:1,position:"relative"}}>
          {allMonths.map(function(mo,i){
            var pct=tlToPct(mo);
            var isJan=mo.getMonth()===0;
            var label=mo.toLocaleDateString("en-GB",{month:"short"});
            return (
              <div key={i} style={{position:"absolute",left:pct+"%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{width:isJan?"1.5px":"0.5px",height:4,background:isJan?"rgba(98,48,15,0.35)":"rgba(98,48,15,0.18)",marginBottom:1}} />
                <span style={{fontSize:7,color:isJan?"rgba(98,48,15,0.65)":"#B8B0A8",letterSpacing:0.3,whiteSpace:"nowrap"}}>{label}</span>
              </div>
            );
          })}
          <div style={{position:"absolute",left:tlTodayPct+"%",bottom:0,transform:"translateX(-50%)",fontSize:7,color:"#C0392B",fontWeight:700,whiteSpace:"nowrap",letterSpacing:0.3}}>now</div>
        </div>
      </div>
    </div>
  );
}

export default function BloomV5() {
  var _s = useState("login"); var screen = _s[0]; var setScreen = _s[1];
  var _a = useState(null); var admin = _a[0]; var setAdmin = _a[1];
  var _g = useState(false); var isGuest = _g[0]; var setIsGuest = _g[1];
  var _mob = useState(typeof window !== "undefined" && window.innerWidth < 768); var isMobile = _mob[0]; var setIsMobile = _mob[1];
  var _l = useState("en"); var lang = _l[0]; var setLang = _l[1];
  var _p = useState(""); var pw = _p[0]; var setPw = _p[1];
  var _pe = useState(false); var pwErr = _pe[0]; var setPwErr = _pe[1];
  var _p1 = useState(false); var p1Open = _p1[0]; var setP1Open = _p1[1];
  var _p1k = useState(null); var p1Kpi = _p1k[0]; var setP1Kpi = _p1k[1];
  var _p1b = useState(true); var p1BreakOpen = _p1b[0]; var setP1BreakOpen = _p1b[1];
  var _p1s = useState(null); var p1StgOpen = _p1s[0]; var setP1StgOpen = _p1s[1];
  var _p2 = useState(false); var p2Open = _p2[0]; var setP2Open = _p2[1];
  var _c = useState({}); var cats = _c[0]; var setCats = _c[1];
  var _pn = useState(null); var panel = _pn[0]; var setPanel = _pn[1];
  var _p2pn = useState(null); var p2Panel = _p2pn[0]; var setP2Panel = _p2pn[1];
  var _p2so = useState(null); var p2SetStg = _p2so[0]; var setP2SetStg = _p2so[1];
  var _ro = useState(false); var rootsOn = _ro[0]; var setRootsOn = _ro[1];
  var _ch = useState(false); var chatOpen = _ch[0]; var setChatOpen = _ch[1];
  var _ci = useState(""); var chatIn = _ci[0]; var setChatIn = _ci[1];
  var _lo = useState(false); var langOpen = _lo[0]; var setLangOpen = _lo[1];
  var _hl = useState(false); var hdrLang = _hl[0]; var setHdrLang = _hl[1];
  var _to = useState(null); var toast = _to[0]; var setToast = _to[1];
  var _bl = useState(false); var bloomOpen = _bl[0]; var setBloomOpen = _bl[1];
  var _tl = useState(false); var timelineOpen = _tl[0]; var setTimelineOpen = _tl[1];
  var _tlz = useState(1); var tlZoom = _tlz[0]; var setTlZoom = _tlz[1];
  var _rc = useState(false); var rcOpen = _rc[0]; var setRcOpen = _rc[1];
  var _rcc = useState(null); var rcCardOpen = _rcc[0]; var setRcCardOpen = _rcc[1];
  var _rcb = useState(null); var rcBruCardOpen = _rcb[0]; var setRcBruCardOpen = _rcb[1];
  var _rcn = useState(null); var rcNatCardOpen = _rcn[0]; var setRcNatCardOpen = _rcn[1];
  var _pk = useState(null); var p2Kpi = _pk[0]; var setP2Kpi = _pk[1];
  var _bp = useState(false); var bruPayOpen = _bp[0]; var setBruPayOpen = _bp[1];
  var _np = useState(false); var natPayOpen = _np[0]; var setNatPayOpen = _np[1];
  var _so = useState(null); var stageOpen = _so[0]; var setStageOpen = _so[1];
  var _pu = useState(null); var popup = _pu[0]; var setPopup = _pu[1];
  var _pf = useState({}); var popupForm = _pf[0]; var setPopupForm = _pf[1];
  var _dd = useState(null); var deleteDialog = _dd[0]; var setDeleteDialog = _dd[1];
  var _ho = useState(false); var houseOpen = _ho[0]; var setHouseOpen = _ho[1];
  var _hk = useState(null); var houseKpi = _hk[0]; var setHouseKpi = _hk[1];
  var _hs = useState(null); var houseStgOpen = _hs[0]; var setHouseStgOpen = _hs[1];
  var _hb = useState(false); var houseBreakOpen = _hb[0]; var setHouseBreakOpen = _hb[1];
  var _pb = useState(false); var p2BreakOpen = _pb[0]; var setP2BreakOpen = _pb[1];
  var lpTimer = useRef(null);
  var lpStartY = useRef(0);
  var lpStartX = useRef(0);
  var lpLockKey = useRef(null); // tracks item lock key so it can be released on save/cancel
  var lpScrolled = useRef(false);
  var lpTarget = useRef(null);
  var undoFn = useRef(null);

  // ── Cloudinary attachment config ──
  var CLD_CLOUD = "dhjsldh2q";
  var CLD_PRESET = "bloom_attachments";
  var _ua = useState(false); var uploadingAtt = _ua[0]; var setUploadingAtt = _ua[1];
  var _up = useState(null); var uploadPct = _up[0]; var setUploadPct = _up[1];

  useEffect(function() {
    if (!toast) return;
    var t = setTimeout(function() { setToast(null); }, 3000);
    return function() { clearTimeout(t); };
  }, [toast]);

  useEffect(function() {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1';
    document.head.appendChild(meta);
    return function() { document.head.removeChild(meta); };
  }, []);

  useEffect(function() {
    var onResize = function() { setIsMobile(window.innerWidth < 768); };
    window.addEventListener("resize", onResize);
    return function() { window.removeEventListener("resize", onResize); };
  }, []);

  var handleAttach = function() {
    var input = document.createElement("input");
    input.type = "file";
    input.onchange = function(e) {
      var file = e.target.files[0];
      if (!file) return;

      // ── Build contextual filename ──
      var ctx = popupCtx || {};
      var itemName = (popupForm.name || "attachment").trim();
      var date = popupForm.date ? popupForm.date.replace(/\//g, "-") : "no-date";
      var segments = [itemName];

      // Section breadcrumb
      var arr = ctx.arr;
      if (arr === "p1items") {
        var p1Cat = P1Cats[ctx.catIdx];
        if (p1Cat) segments.push(p1Cat.name);
        segments.push("Phase 1");
      } else if (arr === "p2items") {
        var p2Stg = p2Meta[ctx.stgIdx];
        if (p2Stg) segments.push(tl(p2Stg, "t") || ("Stage " + (ctx.stgIdx + 1)));
        var p2CatOv = catColors["p2items_" + ctx.stgIdx + "_" + ctx.catIdx];
        var p2CatName = (p2CatOv && p2CatOv.name) || cn(ctx.catIdx);
        segments.push(p2CatName);
        segments.push("Phase 2");
      } else if (arr === "hitems") {
        var hStg = hMeta[ctx.stgIdx];
        if (hStg) segments.push(tl(hStg, "t") || ("Stage " + (ctx.stgIdx + 1)));
        var hCatOv = catColors["hitems_" + ctx.stgIdx + "_" + ctx.catIdx];
        var hCatName = (hCatOv && hCatOv.name) || cn(ctx.catIdx);
        segments.push(hCatName);
        segments.push("Brunos House");
      } else if (arr === "landItems") {
        segments.push("Land");
      } else if (arr === "archItems") {
        segments.push("Architecture");
      } else if (arr === "ment") {
        segments.push("Mentoring");
      } else if (arr === "loans") {
        segments.push("Loans");
      } else if (arr === "p1pay") {
        segments.push("Phase 1");
      } else if (arr === "bru2") {
        segments.push("Bruno"); segments.push("Phase 2");
      } else if (arr === "nat2") {
        segments.push("Natalia"); segments.push("Phase 2");
      } else if (arr === "hPay") {
        segments.push("Brunos House");
      } else if (ctx.cardIdx !== undefined) {
        // RC item — card name from RC_CARD_DEFS
        var rcDef = RC_CARD_DEFS[ctx.cardIdx];
        if (rcDef) segments.push(tr(rcDef.key));
        segments.push("Running Costs");
      }

      segments.push(date);

      var ext = file.name.includes(".") ? file.name.split(".").pop() : "";
      var base = segments.map(function(s) {
        return (s || "").replace(/[^a-zA-Z0-9À-ÿ ]/g, "").trim();
      }).filter(Boolean).join(" - ");
      var publicId = "BLOOM/" + base + (ext ? "." + ext : "");

      // ── Upload ──
      setUploadingAtt(true);
      setUploadPct(0);
      var form = new FormData();
      form.append("file", file);
      form.append("upload_preset", CLD_PRESET);
      form.append("public_id", publicId);
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.cloudinary.com/v1_1/" + CLD_CLOUD + "/auto/upload");
      xhr.upload.onprogress = function(ev) {
        if (ev.lengthComputable) setUploadPct(Math.round(ev.loaded / ev.total * 100));
      };
      xhr.onload = function() {
        setUploadPct(null); setUploadingAtt(false);
        try {
          var data = JSON.parse(xhr.responseText);
          if (data.error) { setToast("Upload failed: " + data.error.message); return; }
          var att = { name: base + (ext ? "." + ext : ""), url: data.secure_url };
          setPopupForm(function(prev) {
            return Object.assign({}, prev, { attachments: (prev.attachments || []).concat([att]) });
          });
        } catch(err) { setToast("Upload failed: invalid response"); }
      };
      xhr.onerror = function() { setUploadPct(null); setUploadingAtt(false); setToast("Upload failed: network error"); };
      xhr.send(form);
    };
    input.click();
  };
  // === LONG PRESS (admin only, 450ms) ===

  // ═══ REACTIVE DATA (state + localStorage) ═══
  var _savedRef = useRef(_loadLS());
  var _sd = _savedRef.current;

  var __p1i = useState(_sd.p1items || P1_ITEMS_INIT); var p1Items = __p1i[0]; var setP1Items = __p1i[1];
  var __ldi = useState(_sd.landItems || LAND_ITEMS_INIT); var landItems = __ldi[0]; var setLandItems = __ldi[1];
  var __ari = useState(_sd.archItems || ARCH_ITEMS_INIT); var archItems = __ari[0]; var setArchItems = __ari[1];
  var __lns = useState(_sd.loans || LOANS_INIT); var LOANS = __lns[0]; var setLoans = __lns[1];
  var __p1p = useState(_sd.p1pay || P1PAY_INIT); var P1PAY = __p1p[0]; var setP1Pay = __p1p[1];
  var __mnt = useState(_sd.ment || MENT_INIT); var MENT = __mnt[0]; var setMent = __mnt[1];
  var __p2i = useState(_sd.p2items || P2_ITEMS_INIT); var p2Items = __p2i[0]; var setP2Items = __p2i[1];
  var __b2 = useState(_sd.bru2 || BRU2_INIT); var BRU2 = __b2[0]; var setBru2 = __b2[1];
  var __n2 = useState(_sd.nat2 || NAT2_INIT); var NAT2 = __n2[0]; var setNat2 = __n2[1];
  var __hi = useState(_sd.hitems || H_ITEMS_INIT); var hItems = __hi[0]; var setHItems = __hi[1];
  var __hp = useState(_sd.hPay || H_PAY_INIT); var H_PAY = __hp[0]; var setHPay = __hp[1];
  var __p2m = useState(_sd.p2meta || P2_META_INIT); var p2Meta = __p2m[0]; var setP2Meta = __p2m[1];
  var __hm = useState(_sd.hmeta || H_META_INIT); var hMeta = __hm[0]; var setHMeta = __hm[1];
  var P1_META_INIT = [{startDate:"",endDate:""},{startDate:"",endDate:""},{startDate:"",endDate:""},{startDate:"",endDate:""}];
  var __p1m = useState(_sd.p1meta || P1_META_INIT); var p1Meta = __p1m[0]; var setP1Meta = __p1m[1];
  var __rci = useState(_sd.rcItems || [[],[],[],[],[],[],[]]); var rcItems = __rci[0]; var setRcItems = __rci[1];
  var __rcb = useState(_sd.rcBruPay || [[],[],[],[],[],[],[]]); var rcBruPay = __rcb[0]; var setRcBruPay = __rcb[1];
  var __rcn = useState(_sd.rcNatPay || [[],[],[],[],[],[],[]]); var rcNatPay = __rcn[0]; var setRcNatPay = __rcn[1];
  var __pctx = useState(null); var popupCtx = __pctx[0]; var setPopupCtx = __pctx[1];
  var __cc2 = useState(_sd.catColors || {}); var catColors = __cc2[0]; var setCatColors = __cc2[1];

  // ═══ COMPUTED VALUES (recalculate every render) ═══
  var LAND = _sumB(landItems); var LANDG = _sumG(landItems);
  var ARCH = _sumB(archItems); var ARCHG = _sumG(archItems);
  var P1V = p1Items.map(_sumB);
  var P1G = p1Items.map(_sumG);
  var P1C = P1V.reduce(function(a,b){return a+b;},0);
  var P1CG = P1G.reduce(function(a,b){return a+b;},0);
  var LT = LOANS.reduce(function(s,l){return s+l.a;},0);
  var LTG = LOANS.reduce(function(s,l){return s+(l.ag||0);},0);
  var LIT = LOANS.reduce(function(s,l){return s+(l.i||0);},0);
  var LITG = LOANS.reduce(function(s,l){return s+(l.ig||0);},0);
  var LCP = LOANS.reduce(function(s,l){return s+(l.cp||0);},0);
  var LIP = LOANS.reduce(function(s,l){return s+(l.ip||0);},0);
  var P1PB = P1PAY.reduce(function(s,p){return s+p.b;},0);
  var P1PG = P1PAY.reduce(function(s,p){return s+(p.g||0);},0);
  var STAGES = useMemo(function(){ return p2Meta.map(function(meta,i){
    var sitems = p2Items[i] || [[],[],[],[],[]];
    var cats = CK.map(function(k,j){ var ci=sitems[j]||[]; var ov=catColors["p2items_"+i+"_"+j]; return {id:k,name:(ov&&ov.name)||null,color:(ov&&ov.color)||CC[j],brl:_sumB(ci),gbp:_sumG(ci),items:ci}; });
    var total = cats.reduce(function(s,c){return s+c.brl;},0);
    var totalG = cats.reduce(function(s,c){return s+c.gbp;},0);
    return {t:meta.t,t_pt:meta.t_pt,t_de:meta.t_de,color:meta.color,brl:total,gbp:totalG,cats:cats};
  }); }, [p2Meta, p2Items, catColors]);
  var STAGE_BRL = STAGES.map(function(s){return s.brl;});
  var STAGE_GBP = STAGES.map(function(s){return s.gbp;});
  var P2V = STAGE_BRL;
  var P2C = P2V.reduce(function(a,b){return a+b;},0);
  var P2CG = STAGE_GBP.reduce(function(a,b){return a+b;},0);
  var MB = MENT.reduce(function(s,i){return s+i.b;},0);
  var MBG = MENT.reduce(function(s,i){return s+(i.g||0);},0);
  var P2T = P2C + MB;
  var P2TG = P2CG + MBG;
  var B2B = BRU2.reduce(function(s,p){return s+p.b;},0);
  var B2G = BRU2.reduce(function(s,p){return s+(p.g||0);},0);
  var N2B = NAT2.reduce(function(s,p){return s+p.b;},0);
  var N2E = NAT2.reduce(function(s,p){return s+(p.e||0);},0);
  var P2PD = B2B + N2B;
  var TP1 = ROOTS+LAND+ARCH+P1C+LIT;
  var TP1G = ROOTSG+LANDG+ARCHG+P1CG+LITG;
  var PD1 = ROOTS+LAND+ARCH+P1PB;
  var FUND_PCT = (P1C+LIT)>0 ? (P1PB/(P1C+LIT)*100) : 0;
  var FUND_COL = FUND_PCT>100?"#8E44AD":FUND_PCT>=100?"#27AE60":FUND_PCT>=75?"#F1C40F":FUND_PCT>=51?"#E67E22":"#C0392B";
  var FUND_SETTLED = FUND_PCT>100?"overFunded":FUND_PCT>=100?"completed":null;
  var PD1G = ROOTSG+LANDG+ARCHG+P1PG;
  var OWF = Math.max(0,(P1C-LT)-P1PB);
  var RM2 = Math.max(0,P2T-P2PD);
  var P2_PCT = P2T>0 ? (P2PD/P2T*100) : 0;
  var P2_COL = P2_PCT>100?"#8E44AD":P2_PCT>=100?"#27AE60":P2_PCT>=75?"#F1C40F":P2_PCT>=51?"#E67E22":"#C0392B";
  var P2_SETTLED = P2_PCT>100?"overFunded":P2_PCT>=100?"completed":null;
  var H_STAGES = useMemo(function(){ return hMeta.map(function(meta,i){
    var sitems = hItems[i] || [[],[],[],[],[]];
    var cats = CK.map(function(k,j){ var ci=sitems[j]||[]; var ov=catColors["hitems_"+i+"_"+j]; return {id:k,name:(ov&&ov.name)||null,color:(ov&&ov.color)||CC[j],brl:_sumB(ci),items:ci}; });
    var total = cats.reduce(function(s,c){return s+c.brl;},0);
    return {t:meta.t,t_pt:meta.t_pt,t_de:meta.t_de,color:meta.color,brl:total,cats:cats};
  }); }, [hMeta, hItems, catColors]);
  var H_STAGE_BRL = H_STAGES.map(function(s){return s.brl;});
  var HCT = H_STAGE_BRL.reduce(function(a,b){return a+b;},0);
  var HPD = H_PAY.reduce(function(s,p){return s+p.b;},0);
  var HRM = HCT-HPD;
  var HOVERFUND = HPD>=HCT;
  var H_PCT = HCT>0 ? (HPD/HCT*100) : 0;
  var H_COL = H_PCT>100?"#8E44AD":H_PCT>=100?"#27AE60":H_PCT>=75?"#F1C40F":H_PCT>=51?"#E67E22":"#C0392B";
  var H_SETTLED = H_PCT>100?"overFunded":H_PCT>=100?"completed":null;
  var BT = TP1+P2T;
  var BRUT = PD1+B2B;
  var NATT = N2B;
  // Date-sort helper (DD/MM/YYYY oldest first, undated last)
  var _dsort = function(arr) {
    return arr.map(function(it,i){return Object.assign({},it,{_oi:i});}).sort(function(a,b){
      var ts = function(d){if(!d)return Infinity;var p=d.split("/");return p.length===3?new Date(p[2],parseInt(p[1],10)-1,parseInt(p[0],10)).getTime():Infinity;};
      return ts(a.date)-ts(b.date);
    });
  };
  var BPCT = BT>0?(BRUT/BT*100):0;
  var NPCT = BT>0?(NATT/BT*100):0;

  // ═══ RUNNING COSTS ═══
  var RC_CARD_DEFS = [{key:"rcLandTax",color:"#C0392B"},{key:"rcWater",color:"#2980B9"},{key:"rcElec",color:"#F39C12"},{key:"rcInternet",color:"#1ABC9C"},{key:"rcGrassMow",color:"#27AE60"},{key:"rcCleaning",color:"#9B59B6"},{key:"rcOthers",color:"#95A5A6"}];
  var RC_CARDS = useMemo(function(){
    return RC_CARD_DEFS.map(function(def,ci){
      var items = rcItems[ci]||[];
      var bruPays = rcBruPay[ci]||[];
      var natPays = rcNatPay[ci]||[];
      // Sort items by date oldest-first for display, preserving original index for itemRef
      var sortedItems = items.map(function(it,ii){return Object.assign({},it,{_origIdx:ii});}).sort(function(a,b){
        var toTs = function(d){ if(!d) return Infinity; var p=d.split("/"); return p.length===3?new Date(p[2],parseInt(p[1],10)-1,parseInt(p[0],10)).getTime():Infinity; };
        return toTs(a.date)-toTs(b.date);
      });
      var costTotal = items.reduce(function(s,it){return s+(it.b||0);},0);
      var bruTotal = bruPays.reduce(function(s,p){return s+(p.b||0);},0);
      var natTotal = natPays.reduce(function(s,p){return s+(p.b||0);},0);
      var totalPaid = bruTotal+natTotal;
      var share = costTotal/2;
      // Per-item balances for pending grid
      var itemBalances = items.map(function(it,ii){
        var itShare = (it.b||0)/2;
        var bruPaidItem = bruPays.filter(function(p){return p.itemRef===ii;}).reduce(function(s,p){return s+(p.b||0);},0);
        var natPaidItem = natPays.filter(function(p){return p.itemRef===ii;}).reduce(function(s,p){return s+(p.b||0);},0);
        return {itemIdx:ii,name:it.name,total:it.b||0,share:itShare,bruPaid:bruPaidItem,natPaid:natPaidItem,bruLeft:Math.max(0,itShare-bruPaidItem),natLeft:Math.max(0,itShare-natPaidItem)};
      });
      return {key:def.key,color:def.color,items:items,sortedItems:sortedItems,bruPays:bruPays,natPays:natPays,costTotal:costTotal,bruTotal:bruTotal,natTotal:natTotal,totalPaid:totalPaid,share:share,bruBalance:bruTotal-share,natBalance:natTotal-share,itemBalances:itemBalances};
    });
  }, [rcItems, rcBruPay, rcNatPay]);
  var RC_TOTAL = RC_CARDS.reduce(function(s,c){return s+c.costTotal;},0);
  var RC_BRU = RC_CARDS.reduce(function(s,c){return s+c.bruTotal;},0);
  var RC_NAT = RC_CARDS.reduce(function(s,c){return s+c.natTotal;},0);
  var RC_BRU_BALANCE = RC_BRU - RC_TOTAL/2;
  var RC_NAT_BALANCE = RC_NAT - RC_TOTAL/2;
  // Pending grid: all items where at least one person still owes
  var RC_PENDING_ITEMS = RC_CARDS.reduce(function(acc,card){
    card.itemBalances.forEach(function(ib){
      if(ib.bruLeft>0.01||ib.natLeft>0.01) acc.push({cardKey:card.key,cardColor:card.color,ib:ib});
    });
    return acc;
  },[]);


  var openPopup = function(type, data, ctx) {
    var d = data || {};
    var f = {name:"",colour:"#C0392B",startDate:"",endDate:"",notes:"",priceBrl:"",priceSecond:"",currLabel:"",date:"",capital:"",capitalG:"",interest:"",interestG:"",usedFor:"",capRepaid:"",capRepaidG:"",intRepaid:"",intRepaidG:"",rcBru:"",rcNat:"",rcItemRef:"",attachments:[]};
    if (type === "editStage" || type === "addStage") { f.name = tl(d,"t") || d.name || ""; f.colour = d.color || "#C0392B"; f.startDate = d.startDate || ""; f.endDate = d.endDate || ""; f.notes = tl(d,"notes"); }
    else if (type === "editCat" || type === "addCat") { f.name = d.name || ""; f.colour = d.color || "#C0392B"; }
    else if (type === "editRcItem" || type === "addRcItem") { f.name = d.name || ""; f.priceBrl = d.b ? String(d.b) : ""; f.date = d.date || ""; f.notes = d.notes || ""; f.attachments = d.attachments || []; }
    else if (type === "editRcPay" || type === "addRcPay") { f.name = d.name || ""; f.priceBrl = d.b ? String(d.b) : ""; f.date = d.date || ""; f.notes = d.notes || ""; f.rcItemRef = d.itemRef !== undefined ? String(d.itemRef) : ""; }
    else if (type === "editItem" || type === "addItem") { f.name = tl(d,"t") || d.name || ""; f.priceBrl = d.b ? String(d.b) : ""; f.priceSecond = d.g ? String(d.g) : d.e ? String(d.e) : ""; f.currLabel = d.g !== undefined ? "\u00a3" : d.e !== undefined ? "\u20ac" : d.currLabel || ""; f.date = d.date || ""; f.notes = tl(d,"notes"); f.attachments = d.attachments || []; }
    else if (type === "editPay" || type === "addPay") { f.name = tl(d,"t") || d.name || ""; f.priceBrl = d.b ? String(d.b) : ""; f.priceSecond = d.g ? String(d.g) : d.e ? String(d.e) : ""; f.currLabel = d.g !== undefined ? "\u00a3" : d.e !== undefined ? "\u20ac" : d.currLabel || ""; f.date = d.date || ""; f.notes = tl(d,"notes"); f.attachments = d.attachments || []; }
    else if (type === "editLoan" || type === "addLoan") { f.name = tl(d,"t") || ""; f.capital = d.a ? String(d.a) : ""; f.capitalG = d.ag ? String(d.ag) : ""; f.interest = d.i ? String(d.i) : ""; f.interestG = d.ig ? String(d.ig) : ""; f.usedFor = tl(d,"use"); f.capRepaid = d.cp ? String(d.cp) : ""; f.capRepaidG = d.cpg ? String(d.cpg) : ""; f.intRepaid = d.ip ? String(d.ip) : ""; f.intRepaidG = d.ipg ? String(d.ipg) : ""; f.attachments = d.attachments || []; }
    setPopupForm(f); setPopup({type:type, data:d}); setPopupCtx(ctx || null);
  };
  var lpStart = function(type, data, e, ctx) {
    if (!isA) return;
    lpScrolled.current = false;
    var touch = e && e.touches; var pt = touch ? e.touches[0] : e;
    lpStartY.current = pt ? pt.clientY : 0;
    lpStartX.current = pt ? pt.clientX : 0;
    lpTarget.current = e ? e.currentTarget : null;
    lpTimer.current = setTimeout(function() {
      if (lpScrolled.current) return;
      if (lpTarget.current) lpTarget.current.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.5)";
      // Build a unique lock key for this item
      var lockKey = type + ":" + (data && (data.t || data.name) ? (data.t || data.name) : "item") + ":" + (ctx ? (ctx.arr||"")+(ctx.idx||"")+(ctx.catIdx||"")+(ctx.stgIdx||"") : "");
      // Acquire lock before opening
      db.acquireLock(lockKey, admin ? admin.name : "admin").then(function(result) {
        if (lpTarget.current) lpTarget.current.style.boxShadow = "";
        lpTarget.current = null;
        if (!result.success) {
          setToast("Locked by " + result.lockedBy);
          return;
        }
        lpLockKey.current = lockKey;
        setTimeout(function() { openPopup(type, data, ctx); }, 150);
      }).catch(function() {
        // Supabase unreachable — proceed without lock (graceful degradation)
        if (lpTarget.current) lpTarget.current.style.boxShadow = "";
        lpTarget.current = null;
        lpLockKey.current = null;
        setTimeout(function() { openPopup(type, data, ctx); }, 150);
      });
    }, 350);
  };
  var lpMove = function(e) {
    if (!lpTimer.current) return;
    var touch = e && e.touches; var pt = touch ? e.touches[0] : e;
    var y = pt ? pt.clientY : 0;
    var x = pt ? pt.clientX : 0;
    if (Math.abs(y - lpStartY.current) > 10 || Math.abs(x - lpStartX.current) > 10) { lpScrolled.current = true; clearTimeout(lpTimer.current); lpTimer.current = null; if (lpTarget.current) lpTarget.current.style.boxShadow = ""; }
  };
  var lpEnd = function() { if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; } if (lpTarget.current) lpTarget.current.style.boxShadow = ""; };
  var confirmDel = function(name, delFn) { setDeleteDialog({name:name, fn:delFn}); };

  var tr = function(k) {
    var table = T[lang] || T.en;
    return table[k] || T.en[k] || k;
  };
  var cn = function(i) { return tr(CK[i]); };
  var tl = function(obj, f) {
    if (!obj) return "";
    if (lang === "pt" && obj[f+"_pt"]) return obj[f+"_pt"];
    if (lang === "de" && obj[f+"_de"]) return obj[f+"_de"];
    return obj[f] || "";
  };
  var isA = !!admin;

  var login = function() {
    var a = ADMINS[pw];
    if (a) { _currentAdmin = a.name; setAdmin(a); setIsGuest(false); setLang(a.defLang); setScreen("app"); }
    else { setPwErr(true); setTimeout(function() { setPwErr(false); }, 1500); }
  };
  var guest = function() { setAdmin(null); setIsGuest(true); setLang("en"); setScreen("app"); };

  // ─── Load from Supabase on admin login ───────────────────────
  useEffect(function() {
    if (!admin) return;
    db.releaseAllLocksByAdmin(admin.name); // clear any stale locks from previous session
    db.loadAll().then(function(data) {
      if (!data || Object.keys(data).length === 0) return;
      // Supabase wins over localStorage on load
      if (data.p1items)  setP1Items(data.p1items);
      if (data.landItems) setLandItems(data.landItems);
      if (data.archItems) setArchItems(data.archItems);
      if (data.loans)    setLoans(data.loans);
      if (data.p1pay)    setP1Pay(data.p1pay);
      if (data.ment)     setMent(data.ment);
      if (data.p2items)  setP2Items(data.p2items);
      if (data.bru2)     setBru2(data.bru2);
      if (data.nat2)     setNat2(data.nat2);
      if (data.hitems)   setHItems(data.hitems);
      if (data.hPay)     setHPay(data.hPay);
      if (data.p2meta)   setP2Meta(data.p2meta);
      if (data.hmeta)    setHMeta(data.hmeta);
      if (data.p1meta)   setP1Meta(data.p1meta);
      if (data.rcItems)  setRcItems(data.rcItems);
      if (data.rcBruPay) setRcBruPay(data.rcBruPay);
      if (data.rcNatPay) setRcNatPay(data.rcNatPay);
      // Refresh localStorage cache from Supabase
      _lsCache = Object.assign(_loadLS(), data);
      localStorage.setItem(LS_KEY, JSON.stringify(_lsCache));
      setToast("✓ Synced");
    }).catch(function(e) {
      console.warn("[BLOOM] Supabase load failed, using local data:", e);
    });
  }, [admin]);

  // ─── Activity log helper (fire and forget) ───────────────────
  var _logAction = function(actionType, section, itemName, oldVal, newVal) {
    if (!admin) return;
    db.logActivity(admin.name, actionType, section, itemName, oldVal, newVal)
      .catch(function(e) { console.warn("[BLOOM] Activity log failed:", e); });
  };

  var mo = useMemo(function(){ return Math.max(1, Math.round((Date.now() - BUILD_START.getTime()) / (1000*60*60*24*30.44))); }, []);

  var P1Cats = useMemo(function(){ return CK.map(function(k, i) { var ov=catColors["p1items_0_"+i]; return {id:k, name:(ov&&ov.name)||cn(i), color:(ov&&ov.color)||CC[i], brl:P1V[i], gbp:P1G[i], items:p1Items[i]||[], ctx:{arr:"p1items",catIdx:i}}; }); }, [p1Items, catColors, lang]);

  // ═══ HELPERS ═══
  var langFlag = useMemo(function(){ return (LANGS.find(function(l) { return l.code === lang; }) || {}).flag; }, [lang]);

  var progressBar = function(paid, total, color) {
    var pct = total > 0 ? Math.min(paid / total * 100, 100) : 0;
    return (
      <div style={{width:"100%",height:8,borderRadius:4,background:"rgba(128,66,24,0.06)",overflow:"hidden"}}>
        <div style={{width:pct+"%",height:"100%",borderRadius:4,background:color,opacity:0.9,transition:"width 1s ease"}} />
      </div>
    );
  };
  var fundBar = function(paid, total, color) {
    var pct = total > 0 ? Math.min(paid / total * 100, 100) : 0;
    var over = paid > total && total > 0;
    var overAmt = over ? paid - total : 0;
    var overPct = over ? Math.min(overAmt / total * 100, 100) : 0;
    var barColor = color || "#27AE60";
    return (
      <div>
        <div style={{width:"100%",height:8,borderRadius:4,background:"rgba(128,66,24,0.06)",overflow:"hidden"}}>
          <div style={{width:pct+"%",height:"100%",borderRadius:4,background:barColor,opacity:0.9,transition:"width 1s ease"}} />
        </div>
        {over && <div style={{marginTop:6}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:9,letterSpacing:1,textTransform:"uppercase",color:"#8E44AD"}}>{tr("overFunded")}</span><span style={{fontSize:9,color:"#8E44AD"}}>{fB(overAmt)+" (+"+(total>0?Math.round(overAmt/total*100):0)+"%)"}</span></div>
          <div style={{width:"100%",height:6,borderRadius:3,background:"rgba(142,68,173,0.1)",overflow:"hidden"}}>
            <div style={{width:overPct+"%",height:"100%",borderRadius:3,background:"#8E44AD",opacity:0.9,transition:"width 1s ease"}} />
          </div>
        </div>}
      </div>
    );
  };

  var donut = function(data, sz, strokeW, children) {
    var r = (sz - strokeW) / 2;
    var circ = 2 * Math.PI * r;
    var tot = data.reduce(function(s, d) { return s + d.v; }, 0);
    var off = 0;
    return (
      <div style={{position:"relative",width:sz,height:sz,margin:"0 auto"}}>
        <svg width={sz} height={sz} style={{transform:"rotate(-90deg)"}}>
          <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="rgba(128,66,24,0.06)" strokeWidth={strokeW} />
          {data.map(function(d, i) {
            var p = tot > 0 ? d.v / tot : 0;
            var da = p * circ;
            var o = off;
            off += da;
            if (p <= 0) return null;
            return <circle key={i} cx={sz/2} cy={sz/2} r={r} fill="none" stroke={d.c} strokeWidth={strokeW} strokeDasharray={da + " " + (circ - da)} strokeDashoffset={-o} style={{transition:"all 0.8s ease"}} />;
          })}
        </svg>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>{children}</div>
      </div>
    );
  };

  var statusBg = function(sc) {
    if (sc === "#27AE60") return "rgba(39,174,96,0.07)";
    if (sc === "#E67E22") return "rgba(230,126,34,0.07)";
    if (sc === "#1ABC9C") return "rgba(26,188,156,0.07)";
    if (sc === "#8E44AD") return "rgba(142,68,173,0.07)";
    if (sc === "#2980B9") return "rgba(41,128,185,0.07)";
    if (sc === "#880E4F") return "rgba(232,67,147,0.07)";
    return "rgba(192,57,43,0.07)";
  };

  var kpi = function(label, vB, vG, color, accent) {
    return (
      <div style={{background:"#fff",borderRadius:14,padding:"18px 16px",position:"relative",overflow:"hidden",boxShadow:"0 2px 20px rgba(44,44,44,0.04)",border:"1px solid rgba(128,66,24,0.06)"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:accent||color,borderRadius:"14px 14px 0 0"}} />
        <div style={{fontSize:8,letterSpacing:2.5,textTransform:"uppercase",color:"#9A9A9A",marginBottom:8}}>{label}</div>
        <div style={{fontFamily:F1,fontSize:22,fontWeight:300,color:color||"#62300F",lineHeight:1}}>{fB(vB)}</div>
        {vG !== undefined && <div style={{fontSize:10,color:"#9A9A9A",marginTop:4}}>{fG(vG)}</div>}
      </div>
    );
  };

  var secHead = function(icon, title, total, gbp, status, sColor) {
    return (
      <div style={{padding:"14px 20px 12px",borderBottom:"1px solid rgba(128,66,24,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>{icon}</span>
          <div style={{fontFamily:F1,fontSize:16,fontWeight:400,letterSpacing:1}}>{title}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {status && <span style={{fontSize:9,padding:"3px 10px",borderRadius:8,background:statusBg(sColor),color:sColor,fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>{status}</span>}
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:14,fontWeight:500,color:"#804218"}}>{fB(total)}</div>
            {gbp !== undefined && <div style={{fontSize:10,color:"#9A9A9A"}}>{fG(gbp)}</div>}
          </div>
        </div>
      </div>
    );
  };

  var _deleteFromCtx = function(ctx) {
    if (!ctx) return;
    // Helper to log the deletion
    var _ld = function(section, item) { _logAction("deleted", section, item && (item.t || item.name || "item"), item, null); };
    if (ctx.arr === "p1items") {
      var _delItem0 = p1Items[ctx.catIdx] && p1Items[ctx.catIdx][ctx.idx];
      _ld("phase1", _delItem0);
      var snap0 = _cloneDeep(p1Items); undoFn.current = function(){setP1Items(snap0);_saveLS({p1items:snap0});};
      var nxt = _cloneDeep(p1Items); nxt[ctx.catIdx].splice(ctx.idx, 1); setP1Items(nxt); _saveLS({p1items:nxt});
    } else if (ctx.arr === "landItems") {
      var snap1 = landItems.slice(); undoFn.current = function(){setLandItems(snap1);_saveLS({landItems:snap1});};
      var a = landItems.filter(function(x,i){return i!==ctx.idx;}); setLandItems(a); _saveLS({landItems:a});
    } else if (ctx.arr === "archItems") {
      var snap2 = archItems.slice(); undoFn.current = function(){setArchItems(snap2);_saveLS({archItems:snap2});};
      var a2 = archItems.filter(function(x,i){return i!==ctx.idx;}); setArchItems(a2); _saveLS({archItems:a2});
    } else if (ctx.arr === "p2items") {
      var snap3 = _cloneDeep(p2Items); undoFn.current = function(){setP2Items(snap3);_saveLS({p2items:snap3});};
      var nxt2 = _cloneDeep(p2Items); nxt2[ctx.stgIdx][ctx.catIdx].splice(ctx.idx, 1); setP2Items(nxt2); _saveLS({p2items:nxt2});
    } else if (ctx.arr === "hitems") {
      var snap4 = _cloneDeep(hItems); undoFn.current = function(){setHItems(snap4);_saveLS({hitems:snap4});};
      var nxt3 = _cloneDeep(hItems); nxt3[ctx.stgIdx][ctx.catIdx].splice(ctx.idx, 1); setHItems(nxt3); _saveLS({hitems:nxt3});
    } else if (ctx.arr === "p1pay") {
      var snap5 = P1PAY.slice(); undoFn.current = function(){setP1Pay(snap5);_saveLS({p1pay:snap5});};
      var a3 = P1PAY.filter(function(x,i){return i!==ctx.idx;}); setP1Pay(a3); _saveLS({p1pay:a3});
    } else if (ctx.arr === "bru2") {
      var snap6 = BRU2.slice(); undoFn.current = function(){setBru2(snap6);_saveLS({bru2:snap6});};
      var a4 = BRU2.filter(function(x,i){return i!==ctx.idx;}); setBru2(a4); _saveLS({bru2:a4});
    } else if (ctx.arr === "nat2") {
      var snap7 = NAT2.slice(); undoFn.current = function(){setNat2(snap7);_saveLS({nat2:snap7});};
      var a5 = NAT2.filter(function(x,i){return i!==ctx.idx;}); setNat2(a5); _saveLS({nat2:a5});
    } else if (ctx.arr === "hPay") {
      var snap8 = H_PAY.slice(); undoFn.current = function(){setHPay(snap8);_saveLS({hPay:snap8});};
      var a6 = H_PAY.filter(function(x,i){return i!==ctx.idx;}); setHPay(a6); _saveLS({hPay:a6});
    } else if (ctx.arr === "ment") {
      var snap9 = MENT.slice(); undoFn.current = function(){setMent(snap9);_saveLS({ment:snap9});};
      var a7 = MENT.filter(function(x,i){return i!==ctx.idx;}); setMent(a7); _saveLS({ment:a7});
    } else if (ctx.arr === "loans") {
      var snap10 = LOANS.slice(); undoFn.current = function(){setLoans(snap10);_saveLS({loans:snap10});};
      var a8 = LOANS.filter(function(x,i){return i!==ctx.idx;}); setLoans(a8); _saveLS({loans:a8});
    } else if (ctx.arr === "p2meta") {
      var snapM1 = _cloneDeep(p2Meta); var snapI1 = _cloneDeep(p2Items); undoFn.current = function(){setP2Meta(snapM1);setP2Items(snapI1);_saveLS({p2meta:snapM1,p2items:snapI1});};
      var nm = _cloneDeep(p2Meta); nm.splice(ctx.idx, 1); setP2Meta(nm);
      var ni = _cloneDeep(p2Items); ni.splice(ctx.idx, 1); setP2Items(ni); _saveLS({p2meta:nm, p2items:ni});
    } else if (ctx.arr === "hmeta") {
      var snapM2 = _cloneDeep(hMeta); var snapI2 = _cloneDeep(hItems); undoFn.current = function(){setHMeta(snapM2);setHItems(snapI2);_saveLS({hmeta:snapM2,hitems:snapI2});};
      var nm2 = _cloneDeep(hMeta); nm2.splice(ctx.idx, 1); setHMeta(nm2);
      var ni2 = _cloneDeep(hItems); ni2.splice(ctx.idx, 1); setHItems(ni2); _saveLS({hmeta:nm2, hitems:ni2});
    }
  };

  var lineItem = function(item, color, showG, showE, lpType, lpTypeOverride, lpCtx) {
    var displayT = tl(item,"t");
    var row = (
      <div key={displayT + "_" + (item.b || 0) + "_" + (lpCtx && lpCtx.idx !== undefined ? lpCtx.idx : displayT.length)}
        onMouseDown={isA&&lpType?function(e){lpStart(lpType,item,e,lpCtx);}:undefined} onMouseMove={isA&&lpType?lpMove:undefined} onMouseUp={isA&&lpType?lpEnd:undefined} onMouseLeave={isA&&lpType?lpEnd:undefined}
        onTouchStart={isA&&lpType?function(e){lpStart(lpType,item,e,lpCtx);}:undefined} onTouchMove={isA&&lpType?lpMove:undefined} onTouchEnd={isA&&lpType?lpEnd:undefined}
        style={{display:"flex",alignItems:"flex-start",gap:8,padding:"8px 0",borderBottom:"1px dashed rgba(128,66,24,0.1)",transition:"box-shadow 0.2s"}}>
        <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500}}>{displayT}</div>{item.date&&(function(){var parts=item.date.split("/");var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];var fmt=parts.length>=3?(months[parseInt(parts[1],10)-1]||parts[1])+" "+parts[2]:"";return fmt?<div style={{fontSize:10,color:"#9A9A9A",marginTop:1}}>{fmt}</div>:null;})()}</div>
        <div style={{display:"flex",alignItems:"center",gap:6,textAlign:"right"}}>
          {item.attachments&&item.attachments.length>0&&<a href={item.attachments[0].url} target="_blank" rel="noopener noreferrer" onClick={function(e){e.stopPropagation();}} style={{fontSize:12,textDecoration:"none",opacity:0.6,flexShrink:0}} title={item.attachments.map(function(a){return a.name;}).join(", ")}>{"📎"+(item.attachments.length>1?item.attachments.length:"")}</a>}
          <div>
            <div style={{fontSize:12,fontWeight:500,color:color}}>{fB(item.b)}</div>
            {showG && item.g !== undefined && <div style={{fontSize:10,color:"#9A9A9A"}}>{fG(item.g)}</div>}
            {showE && item.e !== undefined && <div style={{fontSize:10,color:"#9A9A9A"}}>{fE(item.e)}</div>}
          </div>
        </div>
      </div>
    );
    if (isA && lpType) return <SwipeRow deleteLabel={tr("delBtn")} enabled={true} itemName={displayT} onDelete={function(){confirmDel(displayT, function(){_deleteFromCtx(lpCtx);});}}>{row}</SwipeRow>;
    return row;
  };

  var itemList = function(items, color, showG, showE, addLbl, lpType, addType, addData) {
    return (
      <div style={{padding:"8px 20px 12px"}}>
        {items.map(function(i) { return lineItem(i, color, showG, showE, lpType); })}
        {isA && <button onClick={addType?function(){openPopup(addType,addData||{});}:undefined} style={{width:"100%",padding:"10px",marginTop:6,background:"none",border:"1px dashed rgba(128,66,24,0.15)",borderRadius:10,fontSize:11,color:"#804218",cursor:"pointer",fontFamily:F2,letterSpacing:1}}>{addLbl || tr("newItem")}</button>}
      </div>
    );
  };

  var catList = function(catData, prefix, showG, itemCtxBase) {
    return (
      <div>
        {catData.map(function(c, i) {
          var isOpen = cats[prefix + i];
          var realItems = c.items || [];
          var ctx = c.ctx || (itemCtxBase ? {arr:itemCtxBase.arr, stgIdx:itemCtxBase.stgIdx, catIdx:i} : null);
          var catHeader = (
            <div
              onClick={function() { setCats(function(p) { return Object.assign({}, p, {[prefix+i]: !p[prefix+i]}); }); }}
              onMouseDown={isA?function(e){lpStart("editCat",c,e,ctx);}:undefined} onMouseMove={isA?lpMove:undefined} onMouseUp={isA?lpEnd:undefined} onMouseLeave={isA?lpEnd:undefined}
              onTouchStart={isA?function(e){lpStart("editCat",c,e,ctx);}:undefined} onTouchMove={isA?lpMove:undefined} onTouchEnd={isA?lpEnd:undefined}
              style={{display:"flex",alignItems:"center",padding:"12px 20px",cursor:"pointer",transition:"background 0.15s, box-shadow 0.2s",gap:10,borderBottom:"1px solid rgba(128,66,24,0.04)"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:c.color,flexShrink:0}} />
              <div style={{fontSize:12,flex:1}}>{c.name}</div>
              <div style={{textAlign:"right",marginRight:8}}>
                <div style={{fontSize:12,fontWeight:500}}>{fB(c.brl)}</div>
                {showG && <div style={{fontSize:10,color:"#9A9A9A"}}>{fG(c.gbp)}</div>}
              </div>
              <div style={{width:16,height:16,borderRadius:"50%",background:"#F5F0E8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#6B6B6B",transition:"transform 0.2s",transform:isOpen?"rotate(180deg)":""}}>&#9662;</div>
            </div>
          );
          var delCatFn = function() {
            if (!ctx) return;
            if (ctx.arr === "p1items") {
              var snap1=_cloneDeep(p1Items); undoFn.current=function(){setP1Items(snap1);_saveLS({p1items:snap1});};
              var nxt = _cloneDeep(p1Items); nxt[i] = []; setP1Items(nxt); _saveLS({p1items:nxt});
            } else if (ctx.arr === "p2items") {
              var snap2=_cloneDeep(p2Items); undoFn.current=function(){setP2Items(snap2);_saveLS({p2items:snap2});};
              var nxt2 = _cloneDeep(p2Items); nxt2[ctx.stgIdx][i] = []; setP2Items(nxt2); _saveLS({p2items:nxt2});
            } else if (ctx.arr === "hitems") {
              var snap3=_cloneDeep(hItems); undoFn.current=function(){setHItems(snap3);_saveLS({hitems:snap3});};
              var nxt3 = _cloneDeep(hItems); nxt3[ctx.stgIdx][i] = []; setHItems(nxt3); _saveLS({hitems:nxt3});
            }
          };
          return (
            <div key={c.id}>
              {isA ? <SwipeRow deleteLabel={tr("delBtn")} enabled={true} itemName={c.name} onDelete={function(){confirmDel(c.name, delCatFn);}}>{catHeader}</SwipeRow> : catHeader}
              {isOpen && (
                <div style={{padding:"8px 20px 12px 40px",background:"#FAFAF7",animation:"fadeUp 0.2s ease"}}>
                  {_dsort(realItems).map(function(it) { return lineItem(it, c.color, showG, false, "editItem", null, ctx ? {arr:ctx.arr, stgIdx:ctx.stgIdx, catIdx:ctx.catIdx!==undefined?ctx.catIdx:i, idx:it._oi} : null); })}
                  {isA && ctx && <button onClick={function(){openPopup("addItem",{currLabel:showG?"\u00a3":""},ctx);}} style={{width:"100%",padding:"10px",marginTop:6,background:"none",border:"1px dashed rgba(128,66,24,0.15)",borderRadius:10,fontSize:11,color:"#804218",cursor:"pointer",fontFamily:F2,letterSpacing:1}}>{tr("newItem")}</button>}
                </div>
              )}
            </div>
          );
        })}

      </div>
    );
  };

  var catListRO = function(catData, prefix, showG) {
    return (
      <div>
        {catData.map(function(c, i) {
          var isOpen = cats[prefix + i];
          var realItems = c.items || [];
          return (
            <div key={c.id || i}>
              <div
                onClick={function() { setCats(function(p) { return Object.assign({}, p, {[prefix+i]: !p[prefix+i]}); }); }}
                style={{display:"flex",alignItems:"center",padding:"10px 18px",cursor:"pointer",gap:10,borderBottom:"1px solid rgba(128,66,24,0.04)"}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:c.color,flexShrink:0}} />
                <div style={{fontSize:12,flex:1}}>{c.name}</div>
                <div style={{textAlign:"right",marginRight:8}}>
                  <div style={{fontSize:12,fontWeight:500}}>{fB(c.brl)}</div>
                  {showG && c.gbp !== undefined && <div style={{fontSize:10,color:"#9A9A9A"}}>{fG(c.gbp)}</div>}
                </div>
                <div style={{width:16,height:16,borderRadius:"50%",background:"#F5F0E8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#6B6B6B",transition:"transform 0.2s",transform:isOpen?"rotate(180deg)":""}}>&#9662;</div>
              </div>
              {isOpen && realItems.length > 0 && (
                <div style={{padding:"4px 18px 8px 38px",background:"#FAFAF7",animation:"fadeUp 0.2s ease"}}>
                  {realItems.map(function(it, j) {
                    return (
                      <div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px dashed rgba(128,66,24,0.06)"}}>
                        <div style={{flex:1,fontSize:11,color:"#6B6B6B"}}>{tl(it,"t")}</div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:11,fontWeight:500,color:c.color}}>{fB(it.b)}</div>
                          {showG && it.g !== undefined && <div style={{fontSize:9,color:"#9A9A9A"}}>{fG(it.g)}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  var langDrop = function(open, setOpen, dir) {
    return (
      <div style={{position:"relative",display:"inline-block"}}>
        <button onClick={function() { if (open) { setOpen(false); } else { closeDropdowns(); setOpen(true); } }} style={{background:"transparent",border:"1px solid rgba(201,168,76,0.2)",borderRadius:10,padding:"6px 12px",fontSize:12,cursor:"pointer",color:"#E8D08A",fontFamily:F2}}>{langFlag} {lang.toUpperCase()}</button>
        {open && (
          <div>
            <div onClick={function() { setOpen(false); }} style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:299}} />
            <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",top:dir==="up"?undefined:"calc(100% + 6px)",bottom:dir==="up"?"calc(100% + 6px)":undefined,background:"#62300F",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,overflow:"hidden",minWidth:170,boxShadow:"0 8px 32px rgba(0,0,0,0.4)",zIndex:300}}>
              {LANGS.map(function(o) {
                return <div key={o.code} onClick={function() { sw(o.code); }} style={{padding:"11px 18px",fontSize:13,cursor:"pointer",transition:"background 0.15s",fontFamily:F2,color:lang===o.code?"#C9A84C":"#CE9262"}}>{o.flag + " " + o.name}</div>;
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // === POPUP MODAL (render function, not component) ===
  var updateForm = useCallback(function(key, val) { setPopupForm(function(p) { var n = {}; for (var k in p) n[k] = p[k]; n[key] = val; return n; }); }, []);
  var datePicker = function(key) {
    var val = popupForm[key] || "";
    var parts = val.split("/");
    var dd = parts[0] || ""; var mm = parts[1] || ""; var yy = parts[2] || "2026";
    var sel = {flex:1,border:"1px solid rgba(128,66,24,0.12)",borderRadius:10,padding:"10px 8px",fontSize:13,fontFamily:F2,outline:"none",background:"#fff",color:"#2C2C2C",boxSizing:"border-box",appearance:"none",WebkitAppearance:"none",cursor:"pointer"};
    var upd = function(nd,nm,ny) { updateForm(key, nd+"/"+nm+"/"+ny); };
    var mNames = MONTH_NAMES[lang] || MONTH_NAMES.en;
    return (
      <div style={{display:"flex",gap:8}}>
        <select value={dd} onChange={function(e){upd(e.target.value,mm,yy);}} style={sel}>
          <option value="">{tr("dayPh")}</option>
          {DAYS.map(function(d){return <option key={d} value={d}>{d}</option>;})}
        </select>
        <select value={mm} onChange={function(e){upd(dd,e.target.value,yy);}} style={sel}>
          <option value="">{tr("monthPh")}</option>
          {MONTHS.map(function(m,i){return <option key={m} value={m}>{mNames[i]}</option>;})}
        </select>
        <select value={yy} onChange={function(e){upd(dd,mm,e.target.value);}} style={sel}>
          {YEARS.map(function(y){return <option key={y} value={y}>{y}</option>;})}
        </select>
      </div>
    );
  };
  // ═══ SAVE HANDLER (actually updates state + localStorage) ═══
  var _setTl = function(d, field, val) {
    var r = {};
    r[field] = lang==="en" ? val : (d&&d[field]||"");
    r[field+"_pt"] = lang==="pt" ? val : (d&&d[field+"_pt"]||"");
    r[field+"_de"] = lang==="de" ? val : (d&&d[field+"_de"]||"");
    return r;
  };
  var _autoTr = function(texts, fields, arrKey, locator) {
    if (!texts || texts.length === 0) return;
    var targets = ["en","pt","de"].filter(function(l){return l !== lang;});
    var prompt = "Translate these construction/financial terms from "+lang+" to "+targets.join(" and ")+". Return ONLY valid JSON array matching input order. Each element: {\"en\":\"...\",\"pt\":\"...\",\"de\":\"...\"}.\nInputs: "+JSON.stringify(texts);
    fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,system:"You translate construction/financial terms. Return ONLY valid JSON. No markdown, no backticks.",messages:[{role:"user",content:prompt}]})
    }).then(function(r){return r.json();}).then(function(data){
      try {
        var raw = data.content[0].text.replace(/```json|```/g,"").trim();
        var trs = JSON.parse(raw);
        if (!Array.isArray(trs)) trs = [trs];
        var updates = {};
        for (var i=0; i<fields.length; i++) {
          var tr2 = trs[i] || {};
          updates[fields[i]] = tr2;
        }
        locator(updates);
      } catch(e) { console.log("translate parse err",e); }
    }).catch(function(e){console.log("translate err",e);});
  };
  var doSave = function() {
    var f = popupForm;
    var ctx = popupCtx;
    var t = popup ? popup.type : "";
    var d = popup ? popup.data : {};
    var nm = f.name || tr("untitled");

    // Always release item lock when saving
    if (lpLockKey.current) { db.releaseLock(lpLockKey.current); lpLockKey.current = null; }
    // Determine if this is an add or edit for activity logging
    var _isAdd = t.startsWith("add");
    var _section = t.replace(/^(add|edit)/,"").toLowerCase();

    if (t === "addRcItem" || t === "editRcItem") {
      var brl7 = parseFloat(f.priceBrl) || 0;
      var item7 = {name:nm, b:brl7, date:f.date||"", notes:f.notes||"", attachments:f.attachments||[]};
      var ci7 = ctx && ctx.cardIdx !== undefined ? ctx.cardIdx : 0;
      var nxt7 = _cloneDeep(rcItems);
      if (!nxt7[ci7]) nxt7[ci7] = [];
      if (t === "addRcItem") { nxt7[ci7].push(item7); } else { nxt7[ci7][ctx.idx] = item7; }
      setRcItems(nxt7); _saveLS({rcItems:nxt7});
      _logAction(_isAdd?"added":"edited", "rc", nm, _isAdd?null:d, item7);
      setPopup(null); setPopupCtx(null); setToast(t==="addRcItem"?tr("added"):tr("saved")); return;
    }
    if (t === "addRcPay" || t === "editRcPay") {
      var brl8 = parseFloat(f.priceBrl) || 0;
      var iRef = f.rcItemRef !== "" ? parseInt(f.rcItemRef) : undefined;
      // Cap to remaining balance for this contributor on this item
      if (iRef !== undefined && ctx && ctx.itemBalances) {
        var ibRef = ctx.itemBalances.find(function(ib){return ib.itemIdx===iRef;});
        if (ibRef) {
          var isB8cap = ctx.contributor === "bru";
          var leftCap = isB8cap ? ibRef.bruLeft : ibRef.natLeft;
          // If editing, add back this payment's original amount
          if (t === "editRcPay" && d && d.b) leftCap += (d.b || 0);
          if (brl8 > leftCap) brl8 = leftCap;
        }
      }
      // Auto-generate name: [item name] + bp/np + sequence number
      var ci8 = ctx && ctx.cardIdx !== undefined ? ctx.cardIdx : 0;
      var isB8 = ctx && ctx.contributor === "bru";
      var prefix8 = isB8 ? "bp" : "np";
      var itemName8 = (iRef !== undefined && ctx && ctx.items && ctx.items[iRef]) ? ctx.items[iRef].name : "";
      // Count existing payments for same itemRef + contributor, excluding current payment (edit mode)
      var existingPays8 = isB8 ? (rcBruPay[ci8] || []) : (rcNatPay[ci8] || []);
      var sameRefCount8 = existingPays8.filter(function(p, pi) {
        if (t === "editRcPay" && pi === ctx.idx) return false; // exclude self in edit
        return p.itemRef === iRef;
      }).length;
      var seq8 = sameRefCount8 + 1;
      var autoName8 = prefix8 + seq8;
      var pay8 = {name:autoName8, b:brl8, date:f.date||"", notes:f.notes||"", itemRef:iRef};
      if (isB8) {
        var nb = _cloneDeep(rcBruPay); if (!nb[ci8]) nb[ci8] = [];
        if (t === "addRcPay") { nb[ci8].push(pay8); } else { nb[ci8][ctx.idx] = pay8; }
        setRcBruPay(nb); _saveLS({rcBruPay:nb});
      } else {
        var nn = _cloneDeep(rcNatPay); if (!nn[ci8]) nn[ci8] = [];
        if (t === "addRcPay") { nn[ci8].push(pay8); } else { nn[ci8][ctx.idx] = pay8; }
        setRcNatPay(nn); _saveLS({rcNatPay:nn});
      }
      setPopup(null); setPopupCtx(null); setToast(t==="addRcPay"?tr("added"):tr("saved")); return;
    }
    // ── Stage & Category handlers (don't need item ctx) ──
    if (t === "addStage") {
      var newMeta = _setTl({}, "t", nm);
      newMeta.color = f.colour || STAGE_COLORS[0];
      if (f.startDate) newMeta.startDate = f.startDate;
      if (f.endDate) newMeta.endDate = f.endDate;
      if (ctx && ctx.phase === "house") {
        var nm2 = _cloneDeep(hMeta); nm2.push(newMeta); setHMeta(nm2);
        var ni2 = _cloneDeep(hItems); ni2.push([[],[],[],[],[]]); setHItems(ni2); _saveLS({hmeta:nm2, hitems:ni2});
      } else {
        var nm3 = _cloneDeep(p2Meta); nm3.push(newMeta); setP2Meta(nm3);
        var ni3 = _cloneDeep(p2Items); ni3.push([[],[],[],[],[]]); setP2Items(ni3); _saveLS({p2meta:nm3, p2items:ni3});
      }
      _autoTr([nm], ["t"], "meta", function(u){ var tr3=u.t||{}; var updater=function(prev){var c=_cloneDeep(prev);var it=c[c.length-1];it.t=tr3.en||it.t;it.t_pt=tr3.pt||it.t_pt;it.t_de=tr3.de||it.t_de;return c;}; if(ctx&&ctx.phase==="house"){setHMeta(function(prev){var c=updater(prev);_saveLS({hmeta:c});return c;});}else{setP2Meta(function(prev){var c=updater(prev);_saveLS({p2meta:c});return c;});} });
      setPopup(null); setPopupCtx(null);
      setToast(tr("added"));
      return;
    }
    if (t === "editStage") {
      var tlS = _setTl(d, "t", nm);
      tlS.color = f.colour || d.color;
      if (f.startDate !== undefined) tlS.startDate = f.startDate;
      if (f.endDate !== undefined) tlS.endDate = f.endDate;
      if (ctx && ctx.phase === "p1meta") {
        var nm6 = _cloneDeep(p1Meta); var idx3=ctx.idx;
        nm6[idx3].startDate = f.startDate||""; nm6[idx3].endDate = f.endDate||"";
        setP1Meta(nm6); _saveLS({p1meta:nm6});
      } else if (ctx && ctx.phase === "house") {
        var nm4 = _cloneDeep(hMeta); var idx=ctx.idx; _mergeTl(nm4[idx], tlS); nm4[idx].color=tlS.color; setHMeta(nm4); _saveLS({hmeta:nm4});
      } else {
        var nm5 = _cloneDeep(p2Meta); var idx2=ctx.idx; _mergeTl(nm5[idx2], tlS); nm5[idx2].color=tlS.color; setP2Meta(nm5); _saveLS({p2meta:nm5});
      }
      _autoTr([nm], ["t"], "meta", function(u){ var tr3=u.t||{}; var updater=function(prev,ix){var c=_cloneDeep(prev);c[ix].t=tr3.en||c[ix].t;c[ix].t_pt=tr3.pt||c[ix].t_pt;c[ix].t_de=tr3.de||c[ix].t_de;return c;}; if(ctx&&ctx.phase==="house"){setHMeta(function(prev){var c=updater(prev,ctx.idx);_saveLS({hmeta:c});return c;});}else if(!(ctx&&ctx.phase==="p1meta")){setP2Meta(function(prev){var c=updater(prev,ctx.idx);_saveLS({p2meta:c});return c;});} });
      setPopup(null); setPopupCtx(null);
      setToast(tr("saved"));
      return;
    }
    if (t === "editCat") {
      if (ctx) {
        var ck = ctx.arr+"_"+(ctx.stgIdx||0)+"_"+(ctx.catIdx||0);
        var nc = {}; for (var ck2 in catColors) nc[ck2]=catColors[ck2]; nc[ck]={color:f.colour, name:f.name||undefined};
        setCatColors(nc); _saveLS({catColors:nc});
      }
      setPopup(null); setPopupCtx(null);
      setToast(tr("saved"));
      return;
    }
    if (t === "addCat") {
      setPopup(null); setPopupCtx(null);
      setToast(tr("soon"));
      return;
    }
    if (!ctx) { setPopup(null); setPopupCtx(null); return; }
    var brl = parseFloat(f.priceBrl) || 0;
    var sec = parseFloat(f.priceSecond) || 0;
    var tlT = _setTl(d, "t", nm);
    var tlN = f.notes ? _setTl(d, "notes", f.notes) : {};

    if (ctx.arr === "p1items") {
      var item = _mergeTl({b:brl, g:sec||undefined, date:f.date||undefined, attachments:f.attachments||[]}, tlT);
      if (tlN.notes !== undefined) _mergeTl(item, tlN);
      var nxt = _cloneDeep(p1Items);
      var ci = ctx.catIdx;
      if (!nxt[ci]) nxt[ci] = [];
      if (t === "addItem") { nxt[ci].push(item); } else { nxt[ci][ctx.idx] = item; }
      setP1Items(nxt); _saveLS({p1items:nxt});
      var txts = [nm]; var flds = ["t"]; if (f.notes) { txts.push(f.notes); flds.push("notes"); }
      _autoTr(txts, flds, "p1items", function(u){ setP1Items(function(prev){ var c=_cloneDeep(prev); var it=c[ci][t==="addItem"?c[ci].length-1:ctx.idx]; for(var fk in u){var tr3=u[fk];if(fk==="t"){it.t=tr3.en||it.t;it.t_pt=tr3.pt||it.t_pt;it.t_de=tr3.de||it.t_de;}if(fk==="notes"){it.notes=tr3.en||it.notes;it.notes_pt=tr3.pt||it.notes_pt;it.notes_de=tr3.de||it.notes_de;}} _saveLS({p1items:c}); return c; }); });
    } else if (ctx.arr === "landItems") {
      var lItem = _mergeTl({b:brl, g:sec||undefined, date:f.date||undefined, attachments:f.attachments||[]}, tlT);
      if (tlN.notes !== undefined) _mergeTl(lItem, tlN);
      var lArr;
      if (t === "addItem") { lArr = landItems.concat([lItem]); } else { lArr = landItems.map(function(x,i){return i===ctx.idx?lItem:x;}); }
      setLandItems(lArr); _saveLS({landItems:lArr});
      var txts2 = [nm]; var flds2 = ["t"]; if (f.notes) { txts2.push(f.notes); flds2.push("notes"); }
      _autoTr(txts2, flds2, "landItems", function(u){ setLandItems(function(prev){ var c=prev.map(function(x){return JSON.parse(JSON.stringify(x));}); var idx2=t==="addItem"?c.length-1:ctx.idx; var it=c[idx2]; for(var fk in u){var tr3=u[fk];if(fk==="t"){it.t=tr3.en||it.t;it.t_pt=tr3.pt||it.t_pt;it.t_de=tr3.de||it.t_de;}if(fk==="notes"){it.notes=tr3.en||it.notes;it.notes_pt=tr3.pt||it.notes_pt;it.notes_de=tr3.de||it.notes_de;}} _saveLS({landItems:c}); return c; }); });
    } else if (ctx.arr === "archItems") {
      var aItem = _mergeTl({b:brl, g:sec||undefined, date:f.date||undefined, attachments:f.attachments||[]}, tlT);
      if (tlN.notes !== undefined) _mergeTl(aItem, tlN);
      var aArr;
      if (t === "addItem") { aArr = archItems.concat([aItem]); } else { aArr = archItems.map(function(x,i){return i===ctx.idx?aItem:x;}); }
      setArchItems(aArr); _saveLS({archItems:aArr});
      _autoTr([nm], ["t"], "archItems", function(u){ setArchItems(function(prev){ var c=prev.map(function(x){return JSON.parse(JSON.stringify(x));}); var idx2=t==="addItem"?c.length-1:ctx.idx; var it=c[idx2]; var tr3=u.t||{}; it.t=tr3.en||it.t;it.t_pt=tr3.pt||it.t_pt;it.t_de=tr3.de||it.t_de; _saveLS({archItems:c}); return c; }); });
    } else if (ctx.arr === "p2items") {
      var item2 = _mergeTl({b:brl, g:sec||undefined, date:f.date||undefined, attachments:f.attachments||[]}, tlT);
      if (tlN.notes !== undefined) _mergeTl(item2, tlN);
      var nxt2 = _cloneDeep(p2Items);
      var si = ctx.stgIdx; var ci2 = ctx.catIdx;
      if (!nxt2[si]) nxt2[si] = [[],[],[],[],[]];
      if (!nxt2[si][ci2]) nxt2[si][ci2] = [];
      if (t === "addItem") { nxt2[si][ci2].push(item2); } else { nxt2[si][ci2][ctx.idx] = item2; }
      setP2Items(nxt2); _saveLS({p2items:nxt2});
      _autoTr([nm], ["t"], "p2items", function(u){ setP2Items(function(prev){ var c=_cloneDeep(prev); var it=c[si][ci2][t==="addItem"?c[si][ci2].length-1:ctx.idx]; var tr3=u.t||{}; it.t=tr3.en||it.t;it.t_pt=tr3.pt||it.t_pt;it.t_de=tr3.de||it.t_de; _saveLS({p2items:c}); return c; }); });
    } else if (ctx.arr === "hitems") {
      var item3 = _mergeTl({b:brl, date:f.date||undefined, attachments:f.attachments||[]}, tlT);
      if (tlN.notes !== undefined) _mergeTl(item3, tlN);
      var nxt3 = _cloneDeep(hItems);
      var si2 = ctx.stgIdx; var ci3 = ctx.catIdx;
      if (!nxt3[si2]) nxt3[si2] = [[],[],[],[],[]];
      if (!nxt3[si2][ci3]) nxt3[si2][ci3] = [];
      if (t === "addItem") { nxt3[si2][ci3].push(item3); } else { nxt3[si2][ci3][ctx.idx] = item3; }
      setHItems(nxt3); _saveLS({hitems:nxt3});
      _autoTr([nm], ["t"], "hitems", function(u){ setHItems(function(prev){ var c=_cloneDeep(prev); var it=c[si2][ci3][t==="addItem"?c[si2][ci3].length-1:ctx.idx]; var tr3=u.t||{}; it.t=tr3.en||it.t;it.t_pt=tr3.pt||it.t_pt;it.t_de=tr3.de||it.t_de; _saveLS({hitems:c}); return c; }); });
    } else if (ctx.arr === "p1pay") {
      var pitem = _mergeTl({b:brl, g:sec, date:f.date||undefined, attachments:f.attachments||[]}, tlT);
      if (tlN.notes !== undefined) _mergeTl(pitem, tlN);
      var arr;
      if (t === "addPay") { arr = P1PAY.concat([pitem]); } else { arr = P1PAY.map(function(p,i){return i===ctx.idx?pitem:p;}); }
      setP1Pay(arr); _saveLS({p1pay:arr});
      _autoTr([nm], ["t"], "p1pay", function(u){ setP1Pay(function(prev){ var c=prev.map(function(x){return JSON.parse(JSON.stringify(x));}); var idx2=t==="addPay"?c.length-1:ctx.idx; var it=c[idx2]; var tr3=u.t||{}; it.t=tr3.en||it.t;it.t_pt=tr3.pt||it.t_pt;it.t_de=tr3.de||it.t_de; _saveLS({p1pay:c}); return c; }); });
    } else if (ctx.arr === "bru2") {
      var pitem2 = _mergeTl({b:brl, g:sec, date:f.date||undefined, attachments:f.attachments||[]}, tlT);
      if (tlN.notes !== undefined) _mergeTl(pitem2, tlN);
      var arr2;
      if (t === "addPay") { arr2 = BRU2.concat([pitem2]); } else { arr2 = BRU2.map(function(p,i){return i===ctx.idx?pitem2:p;}); }
      setBru2(arr2); _saveLS({bru2:arr2});
      _autoTr([nm], ["t"], "bru2", function(u){ setBru2(function(prev){ var c=prev.map(function(x){return JSON.parse(JSON.stringify(x));}); var idx2=t==="addPay"?c.length-1:ctx.idx; var it=c[idx2]; var tr3=u.t||{}; it.t=tr3.en||it.t;it.t_pt=tr3.pt||it.t_pt;it.t_de=tr3.de||it.t_de; _saveLS({bru2:c}); return c; }); });
    } else if (ctx.arr === "nat2") {
      var pitem3 = _mergeTl({b:brl, e:sec, date:f.date||undefined, attachments:f.attachments||[]}, tlT);
      if (tlN.notes !== undefined) _mergeTl(pitem3, tlN);
      var arr3;
      if (t === "addPay") { arr3 = NAT2.concat([pitem3]); } else { arr3 = NAT2.map(function(p,i){return i===ctx.idx?pitem3:p;}); }
      setNat2(arr3); _saveLS({nat2:arr3});
      _autoTr([nm], ["t"], "nat2", function(u){ setNat2(function(prev){ var c=prev.map(function(x){return JSON.parse(JSON.stringify(x));}); var idx2=t==="addPay"?c.length-1:ctx.idx; var it=c[idx2]; var tr3=u.t||{}; it.t=tr3.en||it.t;it.t_pt=tr3.pt||it.t_pt;it.t_de=tr3.de||it.t_de; _saveLS({nat2:c}); return c; }); });
    } else if (ctx.arr === "hPay") {
      var pitem4 = _mergeTl({b:brl, g:sec, date:f.date||undefined, attachments:f.attachments||[]}, tlT);
      if (tlN.notes !== undefined) _mergeTl(pitem4, tlN);
      var arr4;
      if (t === "addPay") { arr4 = H_PAY.concat([pitem4]); } else { arr4 = H_PAY.map(function(p,i){return i===ctx.idx?pitem4:p;}); }
      setHPay(arr4); _saveLS({hPay:arr4});
      _autoTr([nm], ["t"], "hPay", function(u){ setHPay(function(prev){ var c=prev.map(function(x){return JSON.parse(JSON.stringify(x));}); var idx2=t==="addPay"?c.length-1:ctx.idx; var it=c[idx2]; var tr3=u.t||{}; it.t=tr3.en||it.t;it.t_pt=tr3.pt||it.t_pt;it.t_de=tr3.de||it.t_de; _saveLS({hPay:c}); return c; }); });
    } else if (ctx.arr === "ment") {
      var mitem = _mergeTl({b:brl, date:f.date||undefined, attachments:f.attachments||[]}, tlT);
      if (tlN.notes !== undefined) _mergeTl(mitem, tlN);
      var arr5;
      if (t === "addItem") { arr5 = MENT.concat([mitem]); } else { arr5 = MENT.map(function(m,i){return i===ctx.idx?mitem:m;}); }
      setMent(arr5); _saveLS({ment:arr5});
      _autoTr([nm], ["t"], "ment", function(u){ setMent(function(prev){ var c=prev.map(function(x){return JSON.parse(JSON.stringify(x));}); var idx2=t==="addItem"?c.length-1:ctx.idx; var it=c[idx2]; var tr3=u.t||{}; it.t=tr3.en||it.t;it.t_pt=tr3.pt||it.t_pt;it.t_de=tr3.de||it.t_de; _saveLS({ment:c}); return c; }); });
    } else if (ctx.arr === "loans") {
      var cap = parseFloat(f.capital) || 0;
      var capG = parseFloat(f.capitalG) || 0;
      var int0 = parseFloat(f.interest) || 0;
      var intG = parseFloat(f.interestG) || 0;
      var cpR = parseFloat(f.capRepaid) || 0;
      var cpRG = parseFloat(f.capRepaidG) || 0;
      var ipR = parseFloat(f.intRepaid) || 0;
      var ipRG = parseFloat(f.intRepaidG) || 0;
      var tlUse = f.usedFor ? _setTl(d, "use", f.usedFor) : {use:"",use_pt:"",use_de:""};
      var loan = _mergeTl({a:cap, ag:capG, i:int0, ig:intG, cp:cpR, cpg:cpRG, ip:ipR, ipg:ipRG, attachments:f.attachments||[]}, tlT);
      _mergeTl(loan, tlUse);
      var arr6;
      if (t === "addLoan") { arr6 = LOANS.concat([loan]); } else { arr6 = LOANS.map(function(l,i){return i===ctx.idx?loan:l;}); }
      setLoans(arr6); _saveLS({loans:arr6});
      var lTxts = [nm]; var lFlds = ["t"]; if (f.usedFor) { lTxts.push(f.usedFor); lFlds.push("use"); }
      _autoTr(lTxts, lFlds, "loans", function(u){ setLoans(function(prev){ var c=prev.map(function(x){return JSON.parse(JSON.stringify(x));}); var idx2=t==="addLoan"?c.length-1:ctx.idx; var it=c[idx2]; for(var fk in u){var tr3=u[fk];if(fk==="t"){it.t=tr3.en||it.t;it.t_pt=tr3.pt||it.t_pt;it.t_de=tr3.de||it.t_de;}if(fk==="use"){it.use=tr3.en||it.use;it.use_pt=tr3.pt||it.use_pt;it.use_de=tr3.de||it.use_de;}} _saveLS({loans:c}); return c; }); });
    }
    setPopup(null); setPopupCtx(null);
    setToast(t.indexOf("add")===0 ? tr("added") : tr("saved"));
  };

  var renderPopup = function() {
    if (!popup) return null;
    var t = popup.type;
    var d = popup.data || {};
    var title = t==="editStage"?tr("editStage"):t==="addStage"?tr("newStage"):t==="editCat"?tr("editCat"):t==="addCat"?tr("addCat"):t==="editItem"?tr("editItem"):t==="addItem"?tr("addItem"):t==="editPay"?tr("editPay"):t==="addPay"?tr("addPay"):t==="editLoan"?tr("editLoan"):t==="addLoan"?tr("addLoan"):t==="addRcItem"?tr("addRcItem"):t==="editRcItem"?tr("editRcItem"):t==="addRcPay"?tr("addRcPay"):t==="editRcPay"?tr("editRcPay"):"";
    var isP1Meta = popupCtx && popupCtx.phase === "p1meta";
    var showCol = (t==="editStage"||t==="addStage"||t==="editCat"||t==="addCat") && !isP1Meta;
    var showDts = t==="editStage" || t==="addStage";
    var showPrc = t==="editItem"||t==="addItem";
    var showAmt = t==="editPay"||t==="addPay";
    var showLoan = t==="editLoan"||t==="addLoan";
    var showRcItem = t==="addRcItem"||t==="editRcItem";
    var showRcPay = t==="addRcPay"||t==="editRcPay";
    var showDt = showPrc||showAmt||showRcItem||showRcPay;
    var showN = t!=="editCat"&&t!=="addCat"&&!showLoan&&!isP1Meta&&!showRcPay;
    var showAttach = showPrc || showAmt || showRcItem || showLoan;
    var inp = {width:"100%",border:"1px solid rgba(128,66,24,0.12)",borderRadius:10,padding:"10px 14px",fontSize:13,fontFamily:F2,outline:"none",background:"#fff",color:"#2C2C2C",boxSizing:"border-box"};
    var lbl = {fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"#9A9A9A",marginBottom:6,display:"block"};
    return (
      <div onClick={function(){setPopup(null);}} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(8px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeUp 0.15s ease"}}>
        <div onClick={function(e){e.stopPropagation();}} style={{background:"#FDFAF4",borderRadius:24,width:"min(420px,90vw)",maxHeight:"85vh",boxShadow:"0 24px 80px rgba(0,0,0,0.15)",overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <div style={{background:"linear-gradient(135deg,#4E2210,#6B3012)",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <div style={{fontFamily:F1,fontSize:18,fontWeight:400,color:"#E8D08A",letterSpacing:2}}>{title}</div>
            <button onClick={function(){setPopup(null);}} style={{background:"none",border:"none",color:"rgba(232,208,138,0.6)",fontSize:20,cursor:"pointer",lineHeight:1}}>{"\u00d7"}</button>
          </div>
          <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:14,overflowY:"auto",flex:1}}>
            {showN && <div><label style={lbl}>{tr("name")}</label><input value={popupForm.name||""} onChange={function(e){updateForm("name",e.target.value);}} style={inp}/></div>}
            {showCol && <div><label style={lbl}>{tr("colour")}</label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{COLOR_OPTIONS.map(function(c){return <div key={c} onClick={function(){updateForm("colour",c);}} style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:popupForm.colour===c?"3px solid #2C2C2C":"3px solid transparent",transition:"all 0.15s"}}/>;})}</div></div>}
            {showDts && <div style={{display:"flex",gap:10}}><div style={{flex:1}}><label style={lbl}>{tr("startDate")}</label>{datePicker("startDate")}</div><div style={{flex:1}}><label style={lbl}>{tr("endDate")}</label>{datePicker("endDate")}</div></div>}
            {showPrc && <div style={{display:"flex",gap:10}}><div style={{flex:1}}><label style={lbl}>{tr("price")+" (R$)"}</label><input type="number" value={popupForm.priceBrl||""} onChange={function(e){updateForm("priceBrl",e.target.value);}} style={inp}/></div>{popupForm.currLabel && <div style={{flex:1}}><label style={lbl}>{tr("price")+" ("+popupForm.currLabel+")"}</label><input type="number" value={popupForm.priceSecond||""} onChange={function(e){updateForm("priceSecond",e.target.value);}} style={inp}/></div>}</div>}
            {showAmt && <div style={{display:"flex",gap:10}}><div style={{flex:1}}><label style={lbl}>{tr("amount")+" (R$)"}</label><input type="number" value={popupForm.priceBrl||""} onChange={function(e){updateForm("priceBrl",e.target.value);}} style={inp}/></div>{popupForm.currLabel && <div style={{flex:1}}><label style={lbl}>{tr("amount")+" ("+popupForm.currLabel+")"}</label><input type="number" value={popupForm.priceSecond||""} onChange={function(e){updateForm("priceSecond",e.target.value);}} style={inp}/></div>}</div>}
            {showLoan && <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"flex",gap:10}}><div style={{flex:1}}><label style={lbl}>{tr("capital")+" (R$)"}</label><input type="number" value={popupForm.capital||""} onChange={function(e){updateForm("capital",e.target.value);}} style={inp}/></div><div style={{flex:1}}><label style={lbl}>{tr("capital")+" (\u00a3)"}</label><input type="number" value={popupForm.capitalG||""} onChange={function(e){updateForm("capitalG",e.target.value);}} style={inp}/></div></div>
              <div style={{display:"flex",gap:10}}><div style={{flex:1}}><label style={lbl}>{tr("interest")+" (R$)"}</label><input type="number" value={popupForm.interest||""} onChange={function(e){updateForm("interest",e.target.value);}} style={inp} placeholder="0"/></div><div style={{flex:1}}><label style={lbl}>{tr("interest")+" (\u00a3)"}</label><input type="number" value={popupForm.interestG||""} onChange={function(e){updateForm("interestG",e.target.value);}} style={inp} placeholder="0"/></div></div>
              <div><label style={lbl}>{tr("usedFor")}</label><input value={popupForm.usedFor||""} onChange={function(e){updateForm("usedFor",e.target.value);}} style={inp} placeholder={tr("optional")}/></div>
              <div style={{display:"flex",gap:10}}><div style={{flex:1}}><label style={lbl}>{tr("capRepaidL")+" (R$)"}</label><input type="number" value={popupForm.capRepaid||""} onChange={function(e){updateForm("capRepaid",e.target.value);}} style={inp} placeholder="0"/></div><div style={{flex:1}}><label style={lbl}>{tr("capRepaidL")+" (\u00a3)"}</label><input type="number" value={popupForm.capRepaidG||""} onChange={function(e){updateForm("capRepaidG",e.target.value);}} style={inp} placeholder="0"/></div></div>
              <div style={{display:"flex",gap:10}}><div style={{flex:1}}><label style={lbl}>{tr("intRepaidL")+" (R$)"}</label><input type="number" value={popupForm.intRepaid||""} onChange={function(e){updateForm("intRepaid",e.target.value);}} style={inp} placeholder="0"/></div><div style={{flex:1}}><label style={lbl}>{tr("intRepaidL")+" (\u00a3)"}</label><input type="number" value={popupForm.intRepaidG||""} onChange={function(e){updateForm("intRepaidG",e.target.value);}} style={inp} placeholder="0"/></div></div>
            </div>}
            {showRcItem && <div><label style={lbl}>{"Amount (R$)"}</label><input type="number" value={popupForm.priceBrl||""} onChange={function(e){updateForm("priceBrl",e.target.value);}} style={inp}/></div>}
            {showRcPay && (function(){
              var isBru = popupCtx && popupCtx.contributor === "bru";
              var ibs = (popupCtx && popupCtx.itemBalances) || [];
              var currentRef = popupForm.rcItemRef !== "" ? parseInt(popupForm.rcItemRef) : undefined;
              // Filter: only items where this contributor still owes, PLUS the currently selected item (edit mode)
              var availableItems = ibs.filter(function(ib){
                var left = isBru ? ib.bruLeft : ib.natLeft;
                return left > 0.01 || ib.itemIdx === currentRef;
              });
              // Cap = remaining owed for selected item by this contributor
              var selectedIb = currentRef !== undefined ? ibs.find(function(ib){return ib.itemIdx===currentRef;}) : null;
              var maxAmt = selectedIb ? (isBru ? selectedIb.bruLeft : selectedIb.natLeft) : undefined;
              // If editing, add back what this payment already contributed
              if (selectedIb && popup && popup.data && popup.data.b) {
                maxAmt = maxAmt !== undefined ? maxAmt + (popup.data.b || 0) : undefined;
              }
              return (
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div><label style={lbl}>{tr("rcItemFor")}</label>
                    <select value={popupForm.rcItemRef||""} onChange={function(e){updateForm("rcItemRef",e.target.value); updateForm("priceBrl","");}} style={Object.assign({},inp,{appearance:"auto"})} required>
                      <option value="" disabled>{"— Select item —"}</option>
                      {availableItems.map(function(ib){
                        var left = isBru ? ib.bruLeft : ib.natLeft;
                        return <option key={ib.itemIdx} value={String(ib.itemIdx)}>{ib.name+" — "+tr("rcLeft")+": "+fB(left)}</option>;
                      })}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>{"Amount (R$)"+(maxAmt!==undefined?" — max "+fB(maxAmt):"")}</label>
                    <input type="number" value={popupForm.priceBrl||""} min="0" max={maxAmt!==undefined?maxAmt:undefined}
                      onChange={function(e){
                        var v = parseFloat(e.target.value)||0;
                        if(maxAmt!==undefined && v>maxAmt) v=maxAmt;
                        updateForm("priceBrl", v>0?String(v):"");
                      }}
                      style={inp} placeholder={"0 – "+( maxAmt!==undefined?fB(maxAmt):"select item first")}/>
                  </div>
                </div>
              );
            })()}
            {showDt && <div><label style={lbl}>{tr("date")}</label>{datePicker("date")}</div>}
            {showN && <div><label style={lbl}>{tr("notes")}</label><textarea value={popupForm.notes||""} onChange={function(e){updateForm("notes",e.target.value);}} rows={3} style={{width:"100%",border:"1px solid rgba(128,66,24,0.12)",borderRadius:10,padding:"10px 14px",fontSize:13,fontFamily:F2,outline:"none",background:"#fff",color:"#2C2C2C",resize:"vertical",boxSizing:"border-box"}}/></div>}
            {showAttach && (function(){
              var atts = popupForm.attachments || [];
              var atMax = atts.length >= 3;
              return (
                <div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                    <label style={lbl}>{"ATTACHMENTS"}</label>
                    <div style={{fontSize:10,color:atMax?"#C0392B":"#9A9A9A",fontWeight:atMax?600:400,letterSpacing:1}}>{atts.length+"/3"}</div>
                  </div>
                  {atts.map(function(att,ai){
                    return (
                      <div key={ai} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid rgba(128,66,24,0.06)"}}>
                        <a href={att.url} target="_blank" rel="noopener noreferrer" onClick={function(e){e.stopPropagation();}} style={{flex:1,fontSize:12,color:"#804218",textDecoration:"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{"📎 "+att.name}</a>
                        <button onClick={function(){setPopupForm(function(prev){return Object.assign({},prev,{attachments:(prev.attachments||[]).filter(function(_,i){return i!==ai;})});});}} style={{background:"none",border:"none",color:"#C0392B",cursor:"pointer",fontSize:18,padding:"0 4px",flexShrink:0,lineHeight:1}}>{"×"}</button>
                      </div>
                    );
                  })}
                  {uploadingAtt && (
                    <div style={{margin:"8px 0 4px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#9A9A9A",marginBottom:3}}>
                        <span>{"Uploading…"}</span>
                        <span>{uploadPct !== null ? uploadPct+"%" : ""}</span>
                      </div>
                      <div style={{height:4,borderRadius:4,background:"rgba(128,66,24,0.1)",overflow:"hidden"}}>
                        <div style={{height:"100%",borderRadius:4,background:"linear-gradient(90deg,#A8780C,#C9A84C)",width:(uploadPct||0)+"%",transition:"width 0.2s"}} />
                      </div>
                    </div>
                  )}
                  {!atMax && !uploadingAtt && (
                    <button onClick={handleAttach} style={{width:"100%",padding:"8px",marginTop:6,background:"none",border:"1px dashed rgba(128,66,24,0.2)",borderRadius:10,fontSize:11,color:"#804218",cursor:"pointer",fontFamily:F2,letterSpacing:1}}>{"＋ Attach File"}</button>
                  )}
                  {atMax && (
                    <div style={{fontSize:10,color:"#C0392B",textAlign:"center",marginTop:6,padding:"6px",background:"rgba(192,57,43,0.04)",borderRadius:8}}>{"Max 3 attachments — remove one to add another"}</div>
                  )}
                </div>
              );
            })()}
          </div>
          <div style={{padding:"0 24px 20px",display:"flex",gap:10,flexShrink:0}}>
            <button onClick={function(){ if(lpLockKey.current){db.releaseLock(lpLockKey.current);lpLockKey.current=null;} setPopup(null);}} style={{flex:1,background:"transparent",border:"1px solid rgba(128,66,24,0.15)",borderRadius:12,padding:"12px",fontSize:11,fontWeight:500,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer",fontFamily:F2,color:"#804218"}}>{tr("cancel")}</button>
            <button onClick={doSave} style={{flex:1,background:"linear-gradient(135deg,#A8780C,#C9A84C)",color:"#fff",border:"none",borderRadius:12,padding:"12px",fontSize:11,fontWeight:500,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer",fontFamily:F2,boxShadow:"0 4px 20px rgba(201,168,76,0.25)"}}>{tr("save")}</button>
          </div>
        </div>
      </div>
    );
  };

  // === DELETE CONFIRMATION DIALOG ===
  var renderDeleteDialog = function() {
    if (!deleteDialog) return null;
    return (
      <div onClick={function(){setDeleteDialog(null);}} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(8px)",zIndex:510,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeUp 0.15s ease"}}>
        <div onClick={function(e){e.stopPropagation();}} style={{background:"#FDFAF4",borderRadius:24,width:"min(340px,85vw)",boxShadow:"0 24px 80px rgba(0,0,0,0.15)",overflow:"hidden"}}>
          <div style={{background:"linear-gradient(135deg,#4E2210,#6B3012)",padding:"16px 24px"}}>
            <div style={{fontFamily:F1,fontSize:18,fontWeight:400,color:"#E8D08A",letterSpacing:2}}>{tr("confirm")}</div>
          </div>
          <div style={{padding:"20px 24px",textAlign:"center"}}>
            <div style={{fontSize:14,fontWeight:500,color:"#2C2C2C",marginBottom:24}}>{"\u201c"+(deleteDialog.name || "")+"\u201d"}</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={function(){setDeleteDialog(null);}} style={{flex:1,background:"transparent",border:"1px solid rgba(128,66,24,0.15)",borderRadius:12,padding:"13px",fontSize:11,fontWeight:500,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer",fontFamily:F2,color:"#804218"}}>{tr("cancel")}</button>
              <button onClick={function(){var n=deleteDialog.name;var fn=deleteDialog.fn;setDeleteDialog(null);if(fn)fn();setToast(n+" "+tr("undoMsg"));}} style={{flex:1,background:"#E74C3C",color:"#fff",border:"none",borderRadius:12,padding:"13px",fontSize:11,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer",fontFamily:F2,boxShadow:"0 4px 16px rgba(231,76,60,0.3)"}}>{tr("del")}</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  var card = function(children) {
    return <div style={{background:"#fff",borderRadius:16,border:"1px solid rgba(128,66,24,0.06)",boxShadow:"0 2px 20px rgba(44,44,44,0.04)",overflow:"hidden",marginBottom:12}}>{children}</div>;
  };

  // ═══ TIMELINE LOGIC ═══
  var TL_TODAY = new Date();
  var TL_P1_SEGS = [
    {label:"P1S0",name:tr("roots"),color:"#27AE60",startDate:p1Meta[0]&&p1Meta[0].startDate,endDate:p1Meta[0]&&p1Meta[0].endDate,phase:"p1",idx:0},
    {label:"P1S1",name:tr("land"),color:"#2ECC71",startDate:p1Meta[1]&&p1Meta[1].startDate,endDate:p1Meta[1]&&p1Meta[1].endDate,phase:"p1",idx:1},
    {label:"P1S2",name:tr("arch"),color:"#8E44AD",startDate:p1Meta[2]&&p1Meta[2].startDate,endDate:p1Meta[2]&&p1Meta[2].endDate,phase:"p1",idx:2},
    {label:"P1S3",name:tr("construction"),color:"#E67E22",startDate:p1Meta[3]&&p1Meta[3].startDate,endDate:p1Meta[3]&&p1Meta[3].endDate,phase:"p1",idx:3}
  ];
  var TL_P2_SEGS = p2Meta.map(function(s,i){return {label:"P2S"+i,name:tl(s,"t"),color:s.color||"#C4854A",startDate:s.startDate,endDate:s.endDate,phase:"p2",idx:i};});
  var TL_H_SEGS = hMeta.map(function(s,i){return {label:"BHS"+i,name:tl(s,"t"),color:s.color||"#8E44AD",startDate:s.startDate,endDate:s.endDate,phase:"house",idx:i};});
  var tlParseD = function(s){if(!s)return null;var pts=s.split("/");var dd=pts[0];var mm=pts[1];var yy=pts[2];if(!mm||!yy)return null;return new Date(parseInt(yy),parseInt(mm)-1,dd?parseInt(dd):1);};
  var tlParseEndD = function(s){if(!s)return null;var pts=s.split("/");var dd=pts[0];var mm=pts[1];var yy=pts[2];if(!mm||!yy)return null;if(!dd)return new Date(parseInt(yy),parseInt(mm),0);return new Date(parseInt(yy),parseInt(mm)-1,parseInt(dd));};
  var tlAllSegs = TL_P1_SEGS.concat(TL_P2_SEGS).concat(TL_H_SEGS);
  var tlDated = tlAllSegs.filter(function(s){return tlParseD(s.startDate);});
  var tlAllDates = tlDated.reduce(function(arr,s){var sd=tlParseD(s.startDate);var ed=s.endDate?tlParseEndD(s.endDate):TL_TODAY;return arr.concat([sd,ed]);},tlDated.length?[TL_TODAY]:[]);
  var tlAxisMin = new Date(2023,0,1);
  var tlAxisMax = new Date(2028,0,1);
  var tlSpan = tlAxisMax - tlAxisMin || 1;
  var tlToPct = function(d){return Math.max(0,Math.min(100,(d-tlAxisMin)/tlSpan*100));};
  var tlTodayPct = tlToPct(TL_TODAY);
  var tlFmtMo = function(d){return d.toLocaleDateString("en-GB",{month:"short",year:"2-digit"});};
  var tlMonthCount = 60;
  var tlAxisMonths = Array.from({length:tlMonthCount},function(_,i2){return new Date(2023,i2,1);});
  var tlStep = Math.ceil(tlAxisMonths.length/6);

  // ═══ LOGIN ═══
  if (screen === "login") {
    return (
      <div style={{minHeight:"100vh",background:GRAD,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:F2,padding:24}}>
        <style>{CSS}</style>
        <div style={{width:200,height:200,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 24px rgba(201,168,76,0.1)",marginBottom:24,background:"rgba(201,168,76,0.04)"}}><img src="https://res.cloudinary.com/dhjsldh2q/image/upload/v1772914730/bloom_logo.png" style={{width:100,height:100,objectFit:"contain"}} /></div>
        <p style={{fontFamily:F1,fontStyle:"italic",fontSize:25,color:"#E8D08A",marginBottom:32,textAlign:"center",maxWidth:400,lineHeight:1.3}}>{tr("tagline")}</p>
        <div style={{width:"min(340px,100%)",display:"flex",flexDirection:"column",gap:12}}>
          <input value={pw} onChange={function(e){setPw(e.target.value);setPwErr(false);}} onKeyDown={function(e){if(e.key==="Enter")login();}} type="password" placeholder={tr("pwPh")} style={{width:"100%",border:"1px solid "+(pwErr?"#E74C3C":"rgba(201,168,76,0.2)"),borderRadius:14,padding:"14px 20px",fontSize:14,fontFamily:F2,outline:"none",background:"rgba(255,255,255,0.04)",color:"#E8D08A",textAlign:"center",letterSpacing:2}} />
          {pwErr && <div style={{color:"#E74C3C",fontSize:12,textAlign:"center"}}>{tr("wrongPw")}</div>}
          <button onClick={login} style={{background:"linear-gradient(135deg,#A8780C,#C9A84C)",color:"#fff",border:"none",borderRadius:14,padding:"14px",fontSize:13,fontWeight:500,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",fontFamily:F2}}>{tr("adminBtn")}</button>
          <button onClick={guest} style={{background:"transparent",color:"rgba(206,146,98,0.6)",border:"1px solid rgba(206,146,98,0.15)",borderRadius:14,padding:"14px",fontSize:12,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",fontFamily:F2}}>{tr("guestBtn")}</button>
        </div>
        <div style={{marginTop:24}}>{langDrop(langOpen, setLangOpen, "up")}</div>
      </div>
    );
  }

  // ═══ MAIN APP ═══
  return (
    <div style={{minHeight:"100vh",background:"#F5F0E8",fontFamily:F2,color:"#2C2C2C",paddingBottom:100,overflowX:"hidden"}}>
      <style>{CSS}</style>

      {/* HEADER */}
      <div style={{background:GRAD,padding:"20px 20px 24px",textAlign:"center",width:"100%"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <button onClick={function(){ if(admin){db.releaseAllLocksByAdmin(admin.name);} _currentAdmin=null; setScreen("login");setAdmin(null);setPw("");}} style={{background:"none",border:"none",color:"rgba(206,146,98,0.5)",fontSize:12,cursor:"pointer",fontFamily:F2}}>{tr("exit")}</button>
          <div style={{fontSize:10,color:"rgba(201,168,76,0.4)"}}>{"\u25CF"} {tr("synced")}</div>
          {langDrop(hdrLang, setHdrLang, "down")}
        </div>
        <div style={{width:200,height:200,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(201,168,76,0.08)",margin:"0 auto 12px",background:"rgba(201,168,76,0.04)"}}><img src="https://res.cloudinary.com/dhjsldh2q/image/upload/v1772914730/bloom_logo.png" style={{width:100,height:100,objectFit:"contain"}} /></div>
        <p style={{fontSize:"clamp(16px, 4vw, 25px)",letterSpacing:3,textTransform:"uppercase",color:"rgba(206,146,98,0.5)"}}>{tr("tracker")}</p>
        {admin && <p style={{fontFamily:F1,fontStyle:"italic",fontSize:"clamp(18px, 4vw, 25px)",color:"rgba(206,146,98,0.7)",marginTop:8,lineHeight:1.3}}>{tr("welcome")}, {admin.name}</p>}
      </div>

      <div style={{maxWidth:800,width:"100%",margin:"0 auto",padding:"20px 16px"}}>

        {/* ═══ BLOOM OVERVIEW HEADER CARD ═══ */}
        <div onClick={function(){setBloomOpen(!bloomOpen);}} style={{background:"linear-gradient(135deg,#3B1A08,#5C2A0E)",borderRadius:bloomOpen?"20px 20px 0 0":"20px",padding:"22px 24px",marginBottom:bloomOpen?0:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",animation:"fadeUp 0.4s ease both",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:"-40%",right:"-10%",width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)"}} />
          <div style={{position:"relative",zIndex:1,flex:1,textAlign:"center"}}>
            <div style={{fontSize:18,letterSpacing:4,textTransform:"uppercase",color:"rgba(232,208,138,0.6)",marginBottom:6,fontFamily:F2}}>{tr("overview")}</div>
            <div style={{fontSize:16,color:"rgba(232,208,138,0.4)",fontFamily:F1,fontStyle:"italic"}}>{tr("totalInv")}</div>
          </div>
          <span style={{fontSize:12,color:"rgba(232,208,138,0.4)",transition:"transform 0.3s",transform:bloomOpen?"rotate(180deg)":"",flexShrink:0}}>&#9660;</span>
        </div>

        {/* ═══ BLOOM OVERVIEW DROPDOWN ═══ */}
        {bloomOpen && (
        <div style={{background:"#F5F0E8",borderRadius:"0 0 20px 20px",marginBottom:20,overflow:"hidden",animation:"fadeUp 0.3s ease"}}>

        {/* ═══ OVERVIEW ═══ */}
        <div style={{background:"linear-gradient(135deg,#4E2210,#6B3012)",borderRadius:0,padding:"28px 24px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:"-30%",right:"-15%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)"}} />
          <div style={{position:"relative",zIndex:1}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontFamily:F1,fontSize:40,fontWeight:300,color:"#E8D08A"}}>{fB(BT)}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:6}}>{tr("buildSince")} Mar 2025 {"·"} {mo} {tr("months")}</div>
            </div>
            {isMobile ? (
              <div>
                <div style={{display:"flex",gap:0,marginBottom:20}}>
                  <div style={{flex:1,textAlign:"center",minWidth:0,padding:"0 8px",borderRight:"1px solid rgba(255,255,255,0.08)"}}>
                    <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(232,208,138,0.5)",marginBottom:4}}>{tr("phase1")}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",marginBottom:2}}>{tr("totalInv")}</div>
                    <div style={{fontFamily:F1,fontSize:14,fontWeight:300,color:"#fff",marginBottom:6}}>{fB(TP1)}</div>
                    {FUND_PCT>100 ? <div><div style={{fontSize:9,fontWeight:600,color:"#8E44AD"}}>{tr("overFunded")}</div><div style={{fontSize:9,color:"#8E44AD",marginTop:2}}>{fB(PD1-TP1)}</div></div>
                      : FUND_PCT>=100 ? <div style={{fontSize:9,fontWeight:600,color:"#27AE60"}}>{tr("completed")} ✓</div>
                      : <div><div style={{fontSize:9,fontWeight:600,color:"#E67E22"}}>{tr("stillOwe")}</div><div style={{fontSize:9,color:"#E67E22",marginTop:2}}>{fB(TP1-PD1)+" ("+(TP1>0?Math.round((TP1-PD1)/TP1*100):0)+"%)"}</div></div>}
                  </div>
                  <div style={{flex:1,textAlign:"center",minWidth:0,padding:"0 8px"}}>
                    <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(232,208,138,0.5)",marginBottom:4}}>{tr("phase2")}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",marginBottom:2}}>{tr("totalInv")}</div>
                    <div style={{fontFamily:F1,fontSize:14,fontWeight:300,color:"#fff",marginBottom:6}}>{fB(P2T)}</div>
                    {P2_PCT>100 ? <div><div style={{fontSize:9,fontWeight:600,color:"#8E44AD"}}>{tr("overFunded")}</div><div style={{fontSize:9,color:"#8E44AD",marginTop:2}}>{fB(P2PD-P2T)}</div></div>
                      : P2_PCT>=100 ? <div style={{fontSize:9,fontWeight:600,color:"#27AE60"}}>{tr("completed")} ✓</div>
                      : <div><div style={{fontSize:9,fontWeight:600,color:"#C0392B"}}>{tr("stillOwe")}</div><div style={{fontSize:9,color:"#C0392B",marginTop:2}}>{fB(RM2)+" ("+(P2T>0?Math.round(RM2/P2T*100):0)+"%)"}</div></div>}
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>
                  {donut([{v:BRUT,c:"#27AE60"},{v:NATT,c:"#3498DB"},{v:Math.max(0,TP1-PD1),c:"#E67E22"},{v:RM2,c:"#C0392B"}], 200, 18,
                    <div style={{width:136,height:136,minWidth:136,minHeight:136,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",background:"rgba(201,168,76,0.04)"}}><img src="https://res.cloudinary.com/dhjsldh2q/image/upload/v1772914729/bloom_overview.png" style={{width:76,height:76,objectFit:"contain"}} /></div>
                  )}
                </div>
                <div style={{display:"flex",marginTop:16}}>
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,justifyContent:"center"}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:"#27AE60",flexShrink:0}} />
                      <div>
                        <div style={{fontSize:12,color:"#27AE60",fontWeight:500}}>{"Bruno "+BPCT.toFixed(1)+"%"}</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{fB(BRUT)}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,justifyContent:"center"}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:"#3498DB",flexShrink:0}} />
                      <div>
                        <div style={{fontSize:12,color:"#3498DB",fontWeight:500}}>{"Natalia "+NPCT.toFixed(1)+"%"}</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{fB(NATT)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:36}}>
                  <div style={{flex:1,textAlign:"center",minWidth:0}}>
                    <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(232,208,138,0.5)",marginBottom:4}}>{tr("phase1")}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",marginBottom:2}}>{tr("totalInv")}</div>
                    <div style={{fontFamily:F1,fontSize:16,fontWeight:300,color:"#fff",marginBottom:6}}>{fB(TP1)}</div>
                    {FUND_PCT>100 ? <div><div style={{fontSize:10,fontWeight:600,color:"#8E44AD"}}>{tr("overFunded")}</div><div style={{fontSize:10,color:"#8E44AD",marginTop:2}}>{fB(PD1-TP1)}</div></div>
                      : FUND_PCT>=100 ? <div style={{fontSize:10,fontWeight:600,color:"#27AE60"}}>{tr("completed")} ✓</div>
                      : <div><div style={{fontSize:10,fontWeight:600,color:"#E67E22"}}>{tr("stillOwe")}</div><div style={{fontSize:10,color:"#E67E22",marginTop:2}}>{fB(TP1-PD1)+" ("+(TP1>0?Math.round((TP1-PD1)/TP1*100):0)+"%)"}</div></div>}
                  </div>
                  <div style={{flexShrink:0}}>
                    {donut([{v:BRUT,c:"#27AE60"},{v:NATT,c:"#3498DB"},{v:Math.max(0,TP1-PD1),c:"#E67E22"},{v:RM2,c:"#C0392B"}], 260, 24,
                      <div style={{width:200,height:200,minWidth:200,minHeight:200,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",background:"rgba(201,168,76,0.04)"}}><img src="https://res.cloudinary.com/dhjsldh2q/image/upload/v1772914729/bloom_overview.png" style={{width:110,height:110,objectFit:"contain"}} /></div>
                    )}
                  </div>
                  <div style={{flex:1,textAlign:"center",minWidth:0}}>
                    <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(232,208,138,0.5)",marginBottom:4}}>{tr("phase2")}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",marginBottom:2}}>{tr("totalInv")}</div>
                    <div style={{fontFamily:F1,fontSize:16,fontWeight:300,color:"#fff",marginBottom:6}}>{fB(P2T)}</div>
                    {P2_PCT>100 ? <div><div style={{fontSize:10,fontWeight:600,color:"#8E44AD"}}>{tr("overFunded")}</div><div style={{fontSize:10,color:"#8E44AD",marginTop:2}}>{fB(P2PD-P2T)}</div></div>
                      : P2_PCT>=100 ? <div style={{fontSize:10,fontWeight:600,color:"#27AE60"}}>{tr("completed")} ✓</div>
                      : <div><div style={{fontSize:10,fontWeight:600,color:"#C0392B"}}>{tr("stillOwe")}</div><div style={{fontSize:10,color:"#C0392B",marginTop:2}}>{fB(RM2)+" ("+(P2T>0?Math.round(RM2/P2T*100):0)+"%)"}</div></div>}
                  </div>
                </div>
                <div style={{display:"flex",marginTop:16}}>
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,justifyContent:"center"}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:"#27AE60",flexShrink:0}} />
                      <div>
                        <div style={{fontSize:12,color:"#27AE60",fontWeight:500}}>{"Bruno "+BPCT.toFixed(1)+"%"}</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{fB(BRUT)}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,justifyContent:"center"}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:"#3498DB",flexShrink:0}} />
                      <div>
                        <div style={{fontSize:12,color:"#3498DB",fontWeight:500}}>{"Natalia "+NPCT.toFixed(1)+"%"}</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{fB(NATT)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        </div>
        )}

        {/* ═══ TIMELINE HEADER CARD ═══ */}
        <div style={{marginBottom:0}}>
          <div onClick={function(){setTimelineOpen(!timelineOpen);}} style={{background:"linear-gradient(135deg,#5C2814,#7A3E1A)",borderRadius:timelineOpen?"20px 20px 0 0":"20px",padding:"22px 24px",marginBottom:timelineOpen?0:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",animation:"fadeUp 0.4s ease both",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:"-40%",right:"-10%",width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)"}} />
            <div style={{position:"relative",zIndex:1,flex:1,textAlign:"center"}}>
              <div style={{fontSize:18,letterSpacing:4,textTransform:"uppercase",color:"rgba(232,208,138,0.6)",marginBottom:6,fontFamily:F2}}>Timeline</div>
              <div style={{fontSize:16,color:"rgba(232,208,138,0.4)",fontFamily:F1,fontStyle:"italic"}}>{tr("p1")+" \u00b7 "+tr("p2")+" \u00b7 Bruno's House"}</div>
            </div>
            <span style={{fontSize:12,color:"rgba(232,208,138,0.4)",transition:"transform 0.3s",transform:timelineOpen?"rotate(180deg)":"",flexShrink:0}}>&#9660;</span>
          </div>
          {timelineOpen && (
            <div style={{background:"#FCF9F4",borderRadius:"0 0 20px 20px",marginBottom:20,padding:"20px 16px",animation:"fadeUp 0.3s ease",overflow:"hidden"}}>
              {isA&&<div style={{fontSize:9,letterSpacing:1,color:"#B0B0B0",textAlign:"center",marginBottom:12,fontStyle:"italic"}}>Long-press any row to set dates</div>}
              <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(128,66,24,0.06)",padding:"16px 12px 10px"}}>
                {/* Scrollable zoom area */}
                <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch",cursor:tlZoom>1?"grab":"default"}}>
                  <div style={{width:(tlZoom*100)+"%",minWidth:"100%"}}>
                    <TlAxis tlAxisMonths={tlAxisMonths} tlToPct={tlToPct} tlTodayPct={tlTodayPct} tlAxisMin={tlAxisMin} tlAxisMax={tlAxisMax} />
                    <TlGanttGroup segs={TL_P1_SEGS} groupLabel="Phase 1" isA={isA} tlParseD={tlParseD} tlParseEndD={tlParseEndD} tlToPct={tlToPct} tlTodayPct={tlTodayPct} TL_TODAY={TL_TODAY} lpStart={lpStart} lpMove={lpMove} lpEnd={lpEnd} tlAxisMonths={tlAxisMonths} />
                    <div style={{marginBottom:12,paddingLeft:50,height:1,background:"rgba(128,66,24,0.06)"}} />
                    <TlGanttGroup segs={TL_P2_SEGS} groupLabel="Phase 2" isA={isA} tlParseD={tlParseD} tlParseEndD={tlParseEndD} tlToPct={tlToPct} tlTodayPct={tlTodayPct} TL_TODAY={TL_TODAY} lpStart={lpStart} lpMove={lpMove} lpEnd={lpEnd} tlAxisMonths={tlAxisMonths} />
                    <div style={{marginBottom:12,paddingLeft:50,height:1,background:"rgba(128,66,24,0.06)"}} />
                    <TlGanttGroup segs={TL_H_SEGS} groupLabel="Bruno's House" isA={isA} tlParseD={tlParseD} tlParseEndD={tlParseEndD} tlToPct={tlToPct} tlTodayPct={tlTodayPct} TL_TODAY={TL_TODAY} lpStart={lpStart} lpMove={lpMove} lpEnd={lpEnd} tlAxisMonths={tlAxisMonths} />
                  </div>
                </div>
                {/* Today legend */}
                <div style={{paddingLeft:50,display:"flex",alignItems:"center",gap:6,marginTop:6}}>
                  <div style={{width:12,height:2,background:"rgba(192,57,43,0.7)"}} />
                  <span style={{fontSize:8,color:"#C0392B",letterSpacing:0.5}}>{"Today \u2014 "}{TL_TODAY.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</span>
                </div>
                {/* Zoom slider */}
                <div style={{paddingLeft:50,paddingRight:8,marginTop:10,display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:8,color:"#B0B0A8",letterSpacing:0.5,flexShrink:0}}>zoom</span>
                  <input type="range" min="1" max="5" step="0.1" value={tlZoom}
                    onChange={function(e){setTlZoom(parseFloat(e.target.value));}}
                    style={{flex:1,height:3,accentColor:"rgba(98,48,15,0.5)",cursor:"pointer"}} />
                  <span style={{fontSize:9,color:"rgba(98,48,15,0.5)",fontWeight:600,letterSpacing:0.5,flexShrink:0,minWidth:24,textAlign:"right"}}>{tlZoom<=1?"1\u00d7":tlZoom>=5?"5\u00d7":(tlZoom.toFixed(1)+"\u00d7")}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══ RUNNING COSTS HEADER ═══ */}
        <div style={{animation:"fadeUp 0.4s ease both"}}>
          <div onClick={function(){setRcOpen(!rcOpen);if(rcOpen){setRcCardOpen(null);setRcBruCardOpen(null);setRcNatCardOpen(null);}}} style={{background:"linear-gradient(135deg,#7D3620,#985226)",borderRadius:rcOpen?"20px 20px 0 0":"20px",padding:"22px 24px",marginBottom:rcOpen?0:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:"-40%",right:"-10%",width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)"}} />
            <div style={{position:"relative",zIndex:1,flex:1,textAlign:"center"}}>
              <div style={{fontSize:18,letterSpacing:4,textTransform:"uppercase",color:"rgba(232,208,138,0.6)",marginBottom:6,fontFamily:F2}}>{tr("rcTitle")}</div>
              <div style={{fontSize:16,color:"rgba(232,208,138,0.4)",fontFamily:F1,fontStyle:"italic"}}>{tr("rcTotal")}</div>
            </div>
            <span style={{fontSize:12,color:"rgba(232,208,138,0.4)",transition:"transform 0.3s",transform:rcOpen?"rotate(180deg)":"",flexShrink:0}}>&#9660;</span>
          </div>

          {rcOpen && (
          <div style={{background:"#FBF7F0",borderRadius:"0 0 20px 20px",marginBottom:20,animation:"fadeUp 0.3s ease",overflow:"hidden"}}>

            {/* Top strip — labels only */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,background:"rgba(128,66,24,0.06)"}}>
              {[
                {label:tr("rcPending"), color:"#804218"},
                {label:tr("rcBruno"), color:"#27AE60"},
                {label:tr("rcNatalia"), color:"#3498DB"}
              ].map(function(k,ki){return (
                <div key={ki} style={{background:"#fff",padding:"16px 12px",textAlign:"center"}}>
                  <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:k.color,fontWeight:600}}>{k.label}</div>
                </div>
              );})}
            </div>

            {/* Pending grid */}
            <div style={{padding:"12px 16px 4px"}}>
              {RC_PENDING_ITEMS.length === 0 ? (
                <div style={{textAlign:"center",padding:"16px 0 12px",fontSize:12,color:"#27AE60",fontWeight:500}}>{"All settled ✓"}</div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:1}}>
                  {RC_PENDING_ITEMS.map(function(row,ri){
                    var ib = row.ib;
                    var cardName = tr(row.cardKey);
                    var bruSettled = ib.bruLeft <= 0.01;
                    var natSettled = ib.natLeft <= 0.01;
                    return (
                      <div key={ri} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,background:"rgba(128,66,24,0.04)",borderRadius:ri===0?"10px 10px 0 0":ri===RC_PENDING_ITEMS.length-1?"0 0 10px 10px":"0",overflow:"hidden"}}>
                        {/* Item column */}
                        <div style={{background:"#fff",padding:"10px 12px"}}>
                          <div style={{fontSize:12,fontWeight:500,color:"#2C2C2C",lineHeight:1.3}}>{ib.name}</div>
                          <div style={{fontSize:10,color:"#9A9A9A",marginTop:2}}>{fB(ib.total)}</div>
                          <div style={{display:"flex",alignItems:"center",gap:4,marginTop:3}}>
                            <div style={{width:5,height:5,borderRadius:"50%",background:row.cardColor,flexShrink:0}} />
                            <div style={{fontSize:9,color:row.cardColor,letterSpacing:0.5}}>{cardName}</div>
                          </div>
                        </div>
                        {/* Bruno column */}
                        <div style={{background:"#fff",padding:"10px 12px",borderLeft:"1px solid rgba(128,66,24,0.04)"}}>
                          {bruSettled ? (
                            <div style={{fontSize:11,color:"#27AE60",fontWeight:600}}>{tr("rcSettledTick")}</div>
                          ) : (
                            <div>
                              <div style={{fontSize:10,color:"#9A9A9A"}}>{fB(ib.bruPaid)+" "+tr("rcPaidLower")}</div>
                              <div style={{fontSize:12,fontWeight:600,color:"#C0392B",marginTop:2}}>{fB(ib.bruLeft)+" "+tr("rcLeft")}</div>
                            </div>
                          )}
                        </div>
                        {/* Natalia column */}
                        <div style={{background:"#fff",padding:"10px 12px",borderLeft:"1px solid rgba(128,66,24,0.04)"}}>
                          {natSettled ? (
                            <div style={{fontSize:11,color:"#3498DB",fontWeight:600}}>{tr("rcSettledTick")}</div>
                          ) : (
                            <div>
                              <div style={{fontSize:10,color:"#9A9A9A"}}>{fB(ib.natPaid)+" "+tr("rcPaidLower")}</div>
                              <div style={{fontSize:12,fontWeight:600,color:"#C0392B",marginTop:2}}>{fB(ib.bruLeft)+" "+tr("rcLeft")}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 6 fixed cards */}
            <div style={{padding:"16px 16px 20px",display:"flex",flexDirection:"column",gap:12}}>
              {RC_CARDS.map(function(card, ci) {
                var cardName = tr(card.key);
                var isCardOpen = rcCardOpen === ci;
                var isBruOpen = rcBruCardOpen === ci;
                var isNatOpen = rcNatCardOpen === ci;
                var share = card.share;
                var bruBal = card.bruBalance;
                var natBal = card.natBalance;
                return (
                  <div key={ci} style={{background:"#fff",borderRadius:20,border:"1px solid rgba(128,66,24,0.08)",overflow:"hidden",boxShadow:isCardOpen?"0 4px 20px rgba(98,48,15,0.06)":"none",transition:"box-shadow 0.2s"}}>

                    {/* Card header — tap to toggle */}
                    <div onClick={function(){setRcCardOpen(isCardOpen?null:ci);setRcBruCardOpen(null);setRcNatCardOpen(null);}} style={{padding:"18px 20px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:10,height:10,borderRadius:"50%",background:card.color,flexShrink:0}} />
                        <div style={{fontSize:14,fontWeight:600,color:"#2C2C2C"}}>{cardName}</div>
                      </div>
                      <span style={{fontSize:12,color:"#9A9A9A",transition:"transform 0.3s",transform:isCardOpen?"rotate(180deg)":""}}>&#9660;</span>
                    </div>

                    {/* Card body */}
                    {isCardOpen && (
                    <div style={{borderTop:"1px solid rgba(128,66,24,0.06)",animation:"fadeUp 0.2s ease"}}>

                      {/* 4-column header strip */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:1,background:"rgba(128,66,24,0.04)"}}>
                        {[
                          {l:tr("totalWord"),c:"#2C2C2C"},
                          {l:tr("date"),c:"#9A9A9A"},
                          {l:tr("rcBruno"),c:"#27AE60"},
                          {l:tr("rcNatalia"),c:"#3498DB"}
                        ].map(function(k,ki){return (
                          <div key={ki} style={{background:"rgba(255,255,255,0.7)",padding:"8px 6px",textAlign:"center"}}>
                            <div style={{fontSize:8,letterSpacing:1,textTransform:"uppercase",color:k.c,fontWeight:600}}>{k.l}</div>
                          </div>
                        );})}
                      </div>

                      {/* Cost items as table rows */}
                      <div style={{padding:"4px 0 8px"}}>
                        {card.items.length===0 && <div style={{fontSize:11,color:"#B0B0B0",fontStyle:"italic",padding:"10px 18px"}}>{"No items yet"}</div>}
                        {card.sortedItems.map(function(item, si) {
                          var ii = item._origIdx;
                          var dFmt = "";
                          if (item.date) {
                            var parts = item.date.split("/");
                            if (parts.length >= 3) {
                              var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                              dFmt = (months[parseInt(parts[1],10)-1]||parts[1])+" "+parts[2];
                            }
                          }
                          var ib2 = card.itemBalances[ii];
                          var bruLeft2 = ib2 ? ib2.bruLeft : 0;
                          var natLeft2 = ib2 ? ib2.natLeft : 0;
                          var bruSettled2 = bruLeft2 <= 0.01;
                          var natSettled2 = natLeft2 <= 0.01;
                          return (
                            <SwipeRow key={ii} deleteLabel={tr("delBtn")} enabled={isA} itemName={item.name} onDelete={function(){
                              confirmDel(item.name, function(){
                                var snapRci=_cloneDeep(rcItems); undoFn.current=function(){setRcItems(snapRci);_saveLS({rcItems:snapRci});};
                                var nxt=_cloneDeep(rcItems); nxt[ci].splice(ii,1);
                                setRcItems(nxt); _saveLS({rcItems:nxt});
                              });
                            }}>
                              <div
                                onMouseDown={isA?function(e){lpStart("editRcItem",item,e,{cardIdx:ci,idx:ii});}:undefined}
                                onMouseMove={isA?lpMove:undefined} onMouseUp={isA?lpEnd:undefined} onMouseLeave={isA?lpEnd:undefined}
                                onTouchStart={isA?function(e){lpStart("editRcItem",item,e,{cardIdx:ci,idx:ii});}:undefined}
                                onTouchMove={isA?lpMove:undefined} onTouchEnd={isA?lpEnd:undefined}
                                style={{borderBottom:"1px solid rgba(128,66,24,0.04)",cursor:isA?"pointer":"default"}}>
                                <div style={{padding:"8px 18px 4px",fontSize:12,fontWeight:500,color:"#2C2C2C"}}>
                                  {item.name}{item.notes&&<span style={{fontSize:10,color:"#9A9A9A",fontStyle:"italic",marginLeft:6}}>{item.notes}</span>}{item.attachments&&item.attachments.length>0&&item.attachments.map(function(att,ai){return <a key={ai} href={att.url} target="_blank" rel="noopener noreferrer" onClick={function(e){e.stopPropagation();}} style={{marginLeft:5,fontSize:13,textDecoration:"none",opacity:0.7}} title={att.name}>{"📎"}</a>;})}
                                </div>
                                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:1,paddingBottom:8}}>
                                  <div style={{padding:"2px 6px",fontSize:12,fontFamily:F1,color:card.color,textAlign:"center"}}>{fB(item.b)}</div>
                                  <div style={{padding:"2px 6px",fontSize:11,color:"#9A9A9A",textAlign:"center"}}>{dFmt||"—"}</div>
                                  <div style={{padding:"2px 6px",fontSize:11,fontWeight:bruSettled2?600:500,color:bruSettled2?"#27AE60":"#C0392B",textAlign:"center"}}>{bruSettled2?tr("rcSettledTick"):fB(bruLeft2)}</div>
                                  <div style={{padding:"2px 6px",fontSize:11,fontWeight:natSettled2?600:500,color:natSettled2?"#3498DB":"#C0392B",textAlign:"center"}}>{natSettled2?tr("rcSettledTick"):fB(natLeft2)}</div>
                                </div>
                              </div>
                            </SwipeRow>
                          );
                        })}
                        {isA&&<button onClick={function(){openPopup("addRcItem",{},{cardIdx:ci});}} style={{width:"calc(100% - 36px)",margin:"4px 18px",padding:"8px",background:"none",border:"1px dashed rgba(128,66,24,0.15)",borderRadius:10,fontSize:11,color:"#804218",cursor:"pointer",fontFamily:F2,letterSpacing:1,display:"block"}}>{tr("newRcItem")}</button>}
                      </div>
                      {/* Bruno Payments */}
                      <div style={{borderTop:"1px solid rgba(128,66,24,0.06)"}}>
                        <div onClick={function(){setRcBruCardOpen(isBruOpen?null:ci);}} style={{padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",background:"rgba(39,174,96,0.03)"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{width:6,height:6,borderRadius:"50%",background:"#27AE60"}} />
                            <div style={{fontSize:12,fontWeight:500,color:"#27AE60"}}>{tr("rcBruPay2")}</div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{fontFamily:F1,fontSize:14,color:"#27AE60"}}>{fB(card.bruTotal)}</div>
                            <span style={{fontSize:10,color:"#9A9A9A",transition:"transform 0.3s",transform:isBruOpen?"rotate(180deg)":""}}>&#9660;</span>
                          </div>
                        </div>
                        {isBruOpen&&(
                        <div style={{padding:"4px 18px 14px",animation:"fadeUp 0.2s ease"}}>
                          {card.bruPays.length===0&&<div style={{fontSize:11,color:"#B0B0B0",fontStyle:"italic",padding:"6px 0"}}>{"No payments yet"}</div>}
                          {_dsort(card.bruPays).map(function(p,pi){
                            var refItem = p.itemRef!==undefined&&card.items[p.itemRef]?card.items[p.itemRef]:null;
                            var displayName = refItem ? refItem.name + " " + p.name : p.name;
                            return (
                              <SwipeRow key={pi} deleteLabel={tr("delBtn")} enabled={isA} itemName={displayName} onDelete={function(){
                                confirmDel(displayName, function(){
                                  var snapRcb=_cloneDeep(rcBruPay); undoFn.current=function(){setRcBruPay(snapRcb);_saveLS({rcBruPay:snapRcb});};
                                  var nb=_cloneDeep(rcBruPay); nb[ci].splice(p._oi!==undefined?p._oi:pi,1); setRcBruPay(nb); _saveLS({rcBruPay:nb});
                                });
                              }}>
                                <div
                                  onMouseDown={isA?function(e){lpStart("editRcPay",p,e,{cardIdx:ci,idx:p._oi!==undefined?p._oi:pi,contributor:"bru",items:card.items,itemBalances:card.itemBalances});}:undefined}
                                  onMouseMove={isA?lpMove:undefined} onMouseUp={isA?lpEnd:undefined} onMouseLeave={isA?lpEnd:undefined}
                                  onTouchStart={isA?function(e){lpStart("editRcPay",p,e,{cardIdx:ci,idx:p._oi!==undefined?p._oi:pi,contributor:"bru",items:card.items,itemBalances:card.itemBalances});}:undefined}
                                  onTouchMove={isA?lpMove:undefined} onTouchEnd={isA?lpEnd:undefined}
                                  style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(128,66,24,0.04)",cursor:isA?"pointer":"default"}}>
                                  <div>
                                    <div style={{fontSize:12,fontWeight:500}}>{displayName}</div>
                                    {p.date&&<div style={{fontSize:10,color:"#9A9A9A"}}>{p.date}</div>}
                                    {p.notes&&<div style={{fontSize:10,color:"#9A9A9A",fontStyle:"italic"}}>{p.notes}</div>}
                                  </div>
                                  <div style={{fontFamily:F1,fontSize:14,color:"#27AE60",flexShrink:0}}>{fB(p.b)}</div>
                                </div>
                              </SwipeRow>
                            );
                          })}
                          {isA&&<button onClick={function(){openPopup("addRcPay",{},{cardIdx:ci,contributor:"bru",items:card.items,itemBalances:card.itemBalances});}} style={{width:"100%",padding:"8px",marginTop:6,background:"none",border:"1px dashed rgba(39,174,96,0.25)",borderRadius:10,fontSize:11,color:"#27AE60",cursor:"pointer",fontFamily:F2,letterSpacing:1}}>{tr("newPay")}</button>}
                        </div>
                        )}
                      </div>

                      {/* Natalia Payments */}
                      <div style={{borderTop:"1px solid rgba(128,66,24,0.06)"}}>
                        <div onClick={function(){setRcNatCardOpen(isNatOpen?null:ci);}} style={{padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",background:"rgba(52,152,219,0.03)"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{width:6,height:6,borderRadius:"50%",background:"#3498DB"}} />
                            <div style={{fontSize:12,fontWeight:500,color:"#3498DB"}}>{tr("rcNatPay2")}</div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{fontFamily:F1,fontSize:14,color:"#3498DB"}}>{fB(card.natTotal)}</div>
                            <span style={{fontSize:10,color:"#9A9A9A",transition:"transform 0.3s",transform:isNatOpen?"rotate(180deg)":""}}>&#9660;</span>
                          </div>
                        </div>
                        {isNatOpen&&(
                        <div style={{padding:"4px 18px 14px",animation:"fadeUp 0.2s ease"}}>
                          {card.natPays.length===0&&<div style={{fontSize:11,color:"#B0B0B0",fontStyle:"italic",padding:"6px 0"}}>{"No payments yet"}</div>}
                          {_dsort(card.natPays).map(function(p,pi){
                            var refItem = p.itemRef!==undefined&&card.items[p.itemRef]?card.items[p.itemRef]:null;
                            var displayName = refItem ? refItem.name + " " + p.name : p.name;
                            return (
                              <SwipeRow key={pi} deleteLabel={tr("delBtn")} enabled={isA} itemName={displayName} onDelete={function(){
                                confirmDel(displayName, function(){
                                  var snapRcn=_cloneDeep(rcNatPay); undoFn.current=function(){setRcNatPay(snapRcn);_saveLS({rcNatPay:snapRcn});};
                                  var nn=_cloneDeep(rcNatPay); nn[ci].splice(p._oi!==undefined?p._oi:pi,1); setRcNatPay(nn); _saveLS({rcNatPay:nn});
                                });
                              }}>
                                <div
                                  onMouseDown={isA?function(e){lpStart("editRcPay",p,e,{cardIdx:ci,idx:p._oi!==undefined?p._oi:pi,contributor:"nat",items:card.items,itemBalances:card.itemBalances});}:undefined}
                                  onMouseMove={isA?lpMove:undefined} onMouseUp={isA?lpEnd:undefined} onMouseLeave={isA?lpEnd:undefined}
                                  onTouchStart={isA?function(e){lpStart("editRcPay",p,e,{cardIdx:ci,idx:p._oi!==undefined?p._oi:pi,contributor:"nat",items:card.items,itemBalances:card.itemBalances});}:undefined}
                                  onTouchMove={isA?lpMove:undefined} onTouchEnd={isA?lpEnd:undefined}
                                  style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(128,66,24,0.04)",cursor:isA?"pointer":"default"}}>
                                  <div>
                                    <div style={{fontSize:12,fontWeight:500}}>{displayName}</div>
                                    {p.date&&<div style={{fontSize:10,color:"#9A9A9A"}}>{p.date}</div>}
                                    {p.notes&&<div style={{fontSize:10,color:"#9A9A9A",fontStyle:"italic"}}>{p.notes}</div>}
                                  </div>
                                  <div style={{fontFamily:F1,fontSize:14,color:"#3498DB",flexShrink:0}}>{fB(p.b)}</div>
                                </div>
                              </SwipeRow>
                            );
                          })}
                          {isA&&<button onClick={function(){openPopup("addRcPay",{},{cardIdx:ci,contributor:"nat",items:card.items,itemBalances:card.itemBalances});}} style={{width:"100%",padding:"8px",marginTop:6,background:"none",border:"1px dashed rgba(52,152,219,0.25)",borderRadius:10,fontSize:11,color:"#3498DB",cursor:"pointer",fontFamily:F2,letterSpacing:1}}>{tr("newPay")}</button>}
                        </div>
                        )}
                      </div>

                    </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          )}
        </div>

        {/* Phase cards */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24,animation:"fadeUp 0.5s ease 0.1s both"}}>
          {[
            {t:tr("p1"),s:tr("p1s"),v:TP1,o:"Bruno 100%",on:p1Open,fn:function(){setP1Open(!p1Open);if(!p1Open)setP2Open(false);},logo:"https://res.cloudinary.com/dhjsldh2q/image/upload/v1772914729/bloom_phase1.png"},
            {t:tr("p2"),s:tr("p2s"),v:P2T,o:P2PD>0?("Bruno "+(B2B/P2PD*100).toFixed(0)+"% \u00b7 Natalia "+(N2B/P2PD*100).toFixed(0)+"%"):"Bruno 0% \u00b7 Natalia 0%",on:p2Open,fn:function(){setP2Open(!p2Open);if(!p2Open)setP1Open(false);},logo:"https://res.cloudinary.com/dhjsldh2q/image/upload/v1772914729/bloom_phase2.png"}
          ].map(function(ph, i) {
            return (
              <button key={i} onClick={ph.fn} style={{background:ph.on?"#fff":"#FDFAF4",border:ph.on?"2px solid rgba(128,66,24,0.12)":"1px solid rgba(128,66,24,0.08)",borderRadius:18,padding:"20px 18px",cursor:"pointer",textAlign:"center",fontFamily:F2,transition:"all 0.25s",boxShadow:ph.on?"0 8px 32px rgba(98,48,15,0.08)":"none"}}>
                <div style={{fontFamily:F1,fontSize:isMobile?24:27,fontWeight:400,letterSpacing:3,textTransform:"uppercase",color:"#62300F",marginBottom:2}}>{ph.t}</div>
                <div style={{fontFamily:F1,fontStyle:"italic",fontSize:isMobile?14:18,color:"rgba(128,66,24,0.5)",marginBottom:14}}>{ph.s}</div>
                <div style={{width:isMobile?110:200,height:isMobile?110:200,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",background:"rgba(201,168,76,0.04)"}}><img src={ph.logo} style={{width:isMobile?55:100,height:isMobile?55:100,objectFit:"contain"}} /></div>
                <div style={{fontFamily:F1,fontSize:22,fontWeight:300,color:"#804218",marginBottom:8}}>{fB(ph.v)}</div>
                <div style={{fontSize:10,color:"#9A9A9A"}}>{ph.o}</div>
              </button>
            );
          })}
        </div>

        {/* ═══ PHASE 1 ═══ */}
        {p1Open && (
          <div style={{animation:"fadeUp 0.3s ease",marginBottom:24}}>
            {/* T1: Interactive KPIs (same as Phase 2) */}
            <div style={{display:"flex",gap:8,marginBottom:20}}>
              {[
                {id:"total",label:tr("totalP1"),vB:TP1,vG:TP1G,color:"#62300F",accent:"#62300F"},
                {id:"paid",label:tr("totalPaid"),vB:PD1,vG:PD1G,color:"#C9A84C",accent:"#C9A84C"},
                {id:"owe",label:tr("phase1"),label2:tr("balance"),vB:TP1-PD1,vG:undefined,color:FUND_COL,accent:FUND_COL,settled:FUND_SETTLED}
              ].map(function(k) {
                var isActive = k.id && p1Kpi === k.id;
                return (
                  <div key={k.label} onClick={k.id ? function(){setP1Kpi(function(prev){return prev===k.id?null:k.id;});} : undefined}
                    style={{flex:1,background:"#fff",borderRadius:14,padding:"14px 10px",textAlign:"center",cursor:k.id?"pointer":"default",border:isActive?"2px solid "+k.accent:"1px solid rgba(128,66,24,0.06)",transition:"all 0.2s",transform:isActive?"scale(1.02)":"none",boxShadow:isActive?"0 4px 20px rgba(201,168,76,0.15)":"0 2px 20px rgba(44,44,44,0.04)"}}>
                    <div style={{width:24,height:3,borderRadius:2,background:k.accent,margin:"0 auto 8px",opacity:isActive?1:0.4,transition:"opacity 0.2s"}} />
                    <div style={{fontSize:9,letterSpacing:1.5,textTransform:"uppercase",color:"#9A9A9A",marginBottom:k.label2?2:4}}>{k.label}</div>
                    {k.label2 && <div style={{fontSize:8,letterSpacing:1,textTransform:"uppercase",color:"#B0B0B0",marginBottom:4}}>{k.label2}</div>}
                    <div style={{fontFamily:F1,fontSize:18,fontWeight:300,color:k.color}}>{k.settled ? tr(k.settled) : fB(k.vB)}</div>
                    {k.vG !== undefined && <div style={{fontSize:10,color:"#9A9A9A",marginTop:4}}>{fG(k.vG)}</div>}
                  </div>
                );
              })}
            </div>

            {/* Panel: Phase 1 Breakdown (from Total P1 KPI) */}
            {p1Kpi === "total" && (
              <div style={{animation:"fadeUp 0.3s ease"}}>
              <div style={{borderRadius:20,overflow:"hidden",marginBottom:20,border:"2px solid rgba(98,48,15,0.2)"}}>
                <div onClick={function(){setP1BreakOpen(!p1BreakOpen);}} style={{background:"linear-gradient(135deg,#4E2210,#6B3012)",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
                  <div><div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(232,208,138,0.5)"}}>{tr("p1Break")}</div><div style={{fontFamily:F1,fontSize:22,fontWeight:300,color:"#E8D08A"}}>{fB(TP1)}</div></div>
                  <span style={{fontSize:12,color:"rgba(232,208,138,0.5)",transition:"transform 0.3s",transform:p1BreakOpen?"rotate(180deg)":""}}>&#9660;</span>
                </div>
                {p1BreakOpen && (
                <div style={{background:"#FBF7F0",padding:"16px",display:"flex",flexDirection:"column",gap:10}}>

                  {/* P1 Breakdown Donut */}
                  <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(98,48,15,0.06)",padding:"20px 18px"}}>
                    {donut([{v:ROOTS,c:"#27AE60"},{v:LAND,c:"#2ECC71"},{v:ARCH,c:"#8E44AD"},{v:P1C,c:"#E67E22"},{v:LIT,c:"#2980B9"}], 160, 20,
                      <div><div style={{fontFamily:F1,fontSize:20,fontWeight:300,color:"#62300F"}}>{fB(TP1)}</div><div style={{fontSize:8,color:"#9A9A9A",letterSpacing:1}}>{tr("totalWord")}</div></div>
                    )}
                    <div style={{marginTop:14,display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"8px 16px"}}>
                      {[{v:ROOTS,c:"#27AE60",l:tr("roots")},{v:LAND,c:"#2ECC71",l:tr("land")},{v:ARCH,c:"#8E44AD",l:tr("arch")},{v:P1C,c:"#E67E22",l:tr("construction")},{v:LIT,c:"#F06292",l:tr("loanInt")}].map(function(s,i){return s.v>0?<div key={i} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:"50%",background:s.c}} /><span style={{fontSize:10,color:"#6B6B6B"}}>{s.l+" "+Math.round(s.v/TP1*100)+"%"}</span></div>:null;})}
                    </div>
                  </div>
                  <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(98,48,15,0.08)",overflow:"hidden"}}>
                    <div onClick={function(){setP1StgOpen(p1StgOpen==="s0"?null:"s0");}} style={{padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:"#27AE60",flexShrink:0}} />
                        <div>
                          <div style={{fontSize:10,color:"#9A9A9A",letterSpacing:1}}>{tr("stageLabel") + " 0"}</div>
                          <div style={{fontSize:13,fontWeight:500}}>{tr("roots")}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontFamily:F1,fontSize:16,color:"#27AE60"}}>{fB(ROOTS)}</div>
                          <div style={{fontSize:10,color:"#9A9A9A"}}>{fG(ROOTSG)}</div>
                        </div>
                        <span style={{fontSize:12,color:"#9A9A9A",transition:"transform 0.3s",transform:p1StgOpen==="s0"?"rotate(180deg)":""}}>&#9660;</span>
                      </div>
                    </div>
                    {p1StgOpen === "s0" && (
                      <div style={{padding:"0 14px 14px",animation:"fadeUp 0.2s ease"}}>
                        <div style={{background:"rgba(39,174,96,0.03)",borderRadius:14,padding:"20px 24px",marginBottom:12,border:"1px solid rgba(39,174,96,0.1)"}}>
                          <div style={{fontFamily:F1,fontStyle:"italic",fontSize:15,color:"#62300F",lineHeight:1.7,marginBottom:16,padding:"12px 16px",background:"rgba(39,174,96,0.04)",borderRadius:12,borderLeft:"3px solid #27AE60"}}>{'"'}{tr("rootsQ")}{'"'}</div>
                          <p style={{fontSize:12,color:"#6B6B6B",lineHeight:1.7,marginBottom:14}}>{tr("rootsIntro")}</p>
                          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                            {[{i:"\uD83E\uDD1D",t:tr("rootsB")},{i:"\uD83D\uDC65",t:tr("rootsT")},{i:"\uD83C\uDF3F",t:tr("rootsV")},{i:"\uD83D\uDD25",t:tr("rootsS")}].map(function(r,j) {
                              return <div key={j} style={{display:"flex",gap:10,alignItems:"flex-start"}}><span style={{fontSize:16}}>{r.i}</span><span style={{fontSize:12,color:"#2C2C2C",lineHeight:1.6}}>{r.t}</span></div>;
                            })}
                          </div>
                          <p style={{fontSize:12,color:"#6B6B6B",lineHeight:1.7,marginBottom:10}}>{tr("rootsW")}</p>
                          <p style={{fontSize:12,color:"#6B6B6B",lineHeight:1.7,marginBottom:10}}>{tr("rootsN")}</p>
                          <p style={{fontSize:12,color:"#804218",fontWeight:500,lineHeight:1.7}}>{tr("rootsNone")}</p>
                        </div>
                        <div style={{background:"rgba(39,174,96,0.04)",borderRadius:12,padding:"14px 18px",marginBottom:10,border:"1px solid rgba(39,174,96,0.08)"}}>
                          <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                            {[{l:tr("rootsFE"),v:fB(ROOTS)},{l:tr("recognized"),v:"\u2705"},{l:tr("investedBy"),v:"Bruno"},{l:tr("period"),v:"2020\u20132021"}].map(function(f,i) {
                              return <div key={i}><div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"#9A9A9A",marginBottom:4}}>{f.l}</div><div style={{fontSize:13,fontWeight:500,color:"#27AE60"}}>{f.v}</div></div>;
                            })}
                          </div>
                        </div>
                        {lineItem({t:tr("rootsFE"),b:ROOTS,g:ROOTSG}, "#27AE60", true, false, null)}
                      </div>
                    )}
                  </div>

                  {/* Stage 1: Land */}
                  <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(98,48,15,0.08)",overflow:"hidden"}}>
                    <div onClick={function(){setP1StgOpen(p1StgOpen==="s1"?null:"s1");}} style={{padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:"#2ECC71",flexShrink:0}} />
                        <div><div style={{fontSize:10,color:"#9A9A9A",letterSpacing:1}}>{tr("stageLabel")+" 1"}</div><div style={{fontSize:13,fontWeight:500}}>{tr("land")}</div></div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{textAlign:"right"}}><div style={{fontFamily:F1,fontSize:16,color:"#2ECC71"}}>{fB(LAND)}</div><div style={{fontSize:10,color:"#9A9A9A"}}>{fG(LANDG)}</div></div>
                        <span style={{fontSize:12,color:"#9A9A9A",transition:"transform 0.3s",transform:p1StgOpen==="s1"?"rotate(180deg)":""}}>&#9660;</span>
                      </div>
                    </div>
                    {p1StgOpen === "s1" && (
                      <div style={{padding:"0 14px 14px",animation:"fadeUp 0.2s ease"}}>
                        <div style={{padding:"16px 0 12px"}}>
                          {donut(landItems.map(function(it,j) { return {v:it.b||0,c:["#2ECC71","#27AE60","#1ABC9C","#16A085","#0E8C73"][j%5]}; }), 120, 16,
                            <div><div style={{fontFamily:F1,fontSize:18,fontWeight:300,color:"#2ECC71"}}>{fB(LAND)}</div><div style={{fontSize:8,color:"#9A9A9A",letterSpacing:1}}>{tr("totalWord")}</div></div>
                          )}
                        </div>
                        {_dsort(landItems).map(function(it) { return lineItem(it, "#2ECC71", true, false, "editItem", null, {arr:"landItems",idx:it._oi}); })}
                        {isA && <button onClick={function(){openPopup("addItem",{currLabel:"\u00a3"},{arr:"landItems"});}} style={{width:"100%",padding:"10px",marginTop:6,background:"none",border:"1px dashed rgba(128,66,24,0.15)",borderRadius:10,fontSize:11,color:"#804218",cursor:"pointer",fontFamily:F2,letterSpacing:1}}>{tr("newItem")}</button>}
                      </div>
                    )}
                  </div>

                  {/* Stage 2: Architecture */}
                  <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(98,48,15,0.08)",overflow:"hidden"}}>
                    <div onClick={function(){setP1StgOpen(p1StgOpen==="s2"?null:"s2");}} style={{padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:"#8E44AD",flexShrink:0}} />
                        <div><div style={{fontSize:10,color:"#9A9A9A",letterSpacing:1}}>{tr("stageLabel")+" 2"}</div><div style={{fontSize:13,fontWeight:500}}>{tr("arch")}</div></div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{textAlign:"right"}}><div style={{fontFamily:F1,fontSize:16,color:"#8E44AD"}}>{fB(ARCH)}</div><div style={{fontSize:10,color:"#9A9A9A"}}>{fG(ARCHG)}</div></div>
                        <span style={{fontSize:12,color:"#9A9A9A",transition:"transform 0.3s",transform:p1StgOpen==="s2"?"rotate(180deg)":""}}>&#9660;</span>
                      </div>
                    </div>
                    {p1StgOpen === "s2" && (
                      <div style={{padding:"0 14px 14px",animation:"fadeUp 0.2s ease"}}>
                        <div style={{padding:"16px 0 12px"}}>
                          {donut(archItems.map(function(it,j) { return {v:it.b||0,c:["#8E44AD","#9B59B6","#A569BD","#7D3C98","#6C3483"][j%5]}; }), 120, 16,
                            <div><div style={{fontFamily:F1,fontSize:18,fontWeight:300,color:"#8E44AD"}}>{fB(ARCH)}</div><div style={{fontSize:8,color:"#9A9A9A",letterSpacing:1}}>{tr("totalWord")}</div></div>
                          )}
                        </div>
                        {_dsort(archItems).map(function(it) { return lineItem(it, "#8E44AD", true, false, "editItem", null, {arr:"archItems",idx:it._oi}); })}
                        {isA && <button onClick={function(){openPopup("addItem",{currLabel:"\u00a3"},{arr:"archItems"});}} style={{width:"100%",padding:"10px",marginTop:6,background:"none",border:"1px dashed rgba(128,66,24,0.15)",borderRadius:10,fontSize:11,color:"#804218",cursor:"pointer",fontFamily:F2,letterSpacing:1}}>{tr("newItem")}</button>}
                      </div>
                    )}
                  </div>

                  {/* Stage 3: Construction (with donut) */}
                  <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(98,48,15,0.08)",overflow:"hidden"}}>
                    <div onClick={function(){setP1StgOpen(p1StgOpen==="s3"?null:"s3");}} style={{padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:"#E67E22",flexShrink:0}} />
                        <div><div style={{fontSize:10,color:"#9A9A9A",letterSpacing:1}}>{tr("stageLabel")+" 3"}</div><div style={{fontSize:13,fontWeight:500}}>{tr("construction")}</div></div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{textAlign:"right"}}><div style={{fontFamily:F1,fontSize:16,color:"#E67E22"}}>{fB(P1C)}</div><div style={{fontSize:10,color:"#9A9A9A"}}>{fG(P1CG)}</div></div>
                        <span style={{fontSize:12,color:"#9A9A9A",transition:"transform 0.3s",transform:p1StgOpen==="s3"?"rotate(180deg)":""}}>&#9660;</span>
                      </div>
                    </div>
                    {p1StgOpen === "s3" && (
                      <div style={{padding:"0 4px 8px",animation:"fadeUp 0.2s ease"}}>
                        <div style={{padding:"16px 14px 12px"}}>
                          {donut(P1Cats.map(function(c) { return {v:c.brl,c:c.color}; }), 120, 16,
                            <div><div style={{fontFamily:F1,fontSize:18,fontWeight:300,color:"#E67E22"}}>{fB(P1C)}</div><div style={{fontSize:8,color:"#9A9A9A",letterSpacing:1}}>{tr("totalWord")}</div></div>
                          )}
                        </div>
                        {catList(P1Cats, "p1c_", true)}
                      </div>
                    )}
                  </div>

                </div>
                )}
              </div>
              </div>
            )}

            {/* Panel: Settlement Dashboard (from Total Paid KPI) */}
            {p1Kpi === "paid" && (
              <div style={{borderRadius:20,overflow:"hidden",marginBottom:20,border:"2px solid rgba(201,168,76,0.25)",animation:"fadeUp 0.3s ease"}}>
                <div style={{background:"linear-gradient(135deg,#C9A84C,#A8780C)",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div><div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.6)"}}>{tr("settle")}</div><div style={{fontFamily:F1,fontSize:22,fontWeight:300,color:"#fff"}}>{fB(PD1)}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginTop:2}}>{fG(PD1G)}</div></div>
                </div>
                <div style={{background:"#FFFDF7",padding:"16px"}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
                    {[
                      {id:"cost",l:tr("constCost"),v:fB(P1C),v2:null,ac:"#C0392B"},
                      {id:"fund",l:tr("loanSec"),v:fB(LT+LIT),v2:null,ac:"#880E4F"},
                      {id:"pay",l:tr("allPay"),v:fB(P1PB),v2:fG(P1PG),ac:"#27AE60"}
                    ].map(function(p) {
                      return (
                        <button key={p.id} onClick={function(){setPanel(panel===p.id?null:p.id);}} style={{background:panel===p.id?"#fff":"#FDFAF4",border:panel===p.id?"2px solid "+p.ac:"1px solid rgba(128,66,24,0.08)",borderRadius:16,padding:"16px 14px",cursor:"pointer",textAlign:"left",fontFamily:F2,transition:"all 0.25s"}}>
                          <div style={{fontSize:11,fontWeight:500,marginBottom:8}}>{p.l}</div>
                          <div style={{fontFamily:F1,fontSize:18,fontWeight:300,color:p.ac}}>{p.v}</div>
                          {p.v2 && <div style={{fontSize:10,color:"#9A9A9A",marginTop:2}}>{p.v2}</div>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Construction Costs panel - read-only expandable tree */}
                  {panel === "cost" && (
                    <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(128,66,24,0.06)",overflow:"hidden",marginBottom:12,animation:"fadeUp 0.2s ease"}}>
                      <div style={{padding:"12px 18px",borderBottom:"1px solid rgba(128,66,24,0.06)"}}><div style={{fontSize:11,fontWeight:600,color:"#C0392B"}}>{tr("constCost")}</div></div>
                      {catListRO(P1Cats, "p1set_", true)}
                      <div style={{display:"flex",justifyContent:"space-between",padding:"12px 18px 10px",borderTop:"2px solid #C0392B"}}>
                        <span style={{fontSize:12,fontWeight:600,color:"#C0392B"}}>{tr("totalWord")}</span>
                        <div style={{display:"flex",gap:12}}>
                          <span style={{fontFamily:F1,fontSize:16,color:"#C0392B"}}>{fB(P1C)}</span>
                          <span style={{fontSize:10,color:"#9A9A9A"}}>{fG(P1CG)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loans panel */}
                  {panel === "fund" && (
                    <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(128,66,24,0.06)",padding:"16px 18px",marginBottom:12,animation:"fadeUp 0.2s ease"}}>
                      <div style={{fontSize:11,fontWeight:600,marginBottom:12,color:"#880E4F"}}>{tr("loanSec")}</div>
                      {LOANS.map(function(ln,j){var loanRow = <div onMouseDown={isA?function(e){lpStart("editLoan",ln,e,{arr:"loans",idx:j});}:undefined} onMouseMove={isA?lpMove:undefined} onMouseUp={isA?lpEnd:undefined} onMouseLeave={isA?lpEnd:undefined} onTouchStart={isA?function(e){lpStart("editLoan",ln,e,{arr:"loans",idx:j});}:undefined} onTouchMove={isA?lpMove:undefined} onTouchEnd={isA?lpEnd:undefined} style={{display:"flex",alignItems:"center",padding:"10px 0",borderBottom:"1px dashed rgba(128,66,24,0.1)",cursor:isA?"pointer":"default",transition:"box-shadow 0.2s"}}><div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{tl(ln,"t")}</div><div style={{display:"flex",gap:12,marginTop:4}}><span style={{fontSize:10,color:"#880E4F"}}>{tr("capital")}: {fB(ln.a)}</span>{ln.i>0&&<span style={{fontSize:10,color:"#F06292"}}>{tr("interest")}: {fB(ln.i)}</span>}</div>{tl(ln,"use")&&<div style={{fontSize:10,color:"#9A9A9A",marginTop:2}}>{tr("usedFor")}: {tl(ln,"use")}</div>}</div><div style={{fontSize:12,fontWeight:500,color:"#804218"}}>{fB(ln.a+(ln.i||0))}</div></div>; return <div key={j}>{isA ? <SwipeRow deleteLabel={tr("delBtn")} enabled={true} itemName={tl(ln,"t")} onDelete={function(){confirmDel(tl(ln,"t"),function(){_deleteFromCtx({arr:"loans",idx:j});});}}>{loanRow}</SwipeRow> : loanRow}</div>;})}
                      {isA && <button onClick={function(){openPopup("addLoan",{},{arr:"loans"});}} style={{width:"100%",padding:"10px",marginTop:6,background:"none",border:"1px dashed rgba(128,66,24,0.15)",borderRadius:10,fontSize:11,color:"#804218",cursor:"pointer",fontFamily:F2,letterSpacing:1}}>{tr("newLoan")}</button>}
                    </div>
                  )}


                  {/* Payments panel */}
                  {panel === "pay" && (
                    <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(128,66,24,0.06)",padding:"16px 18px",marginBottom:12,animation:"fadeUp 0.2s ease"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                        <div style={{fontSize:11,fontWeight:600,color:"#27AE60"}}>{tr("allPay")}</div>
                        <div style={{textAlign:"right"}}><div style={{fontFamily:F1,fontSize:16,color:"#27AE60"}}>{fB(P1PB)}</div><div style={{fontSize:10,color:"#9A9A9A"}}>{fG(P1PG)}</div></div>
                      </div>
                      {_dsort(P1PAY).map(function(p) { return lineItem(p, "#27AE60", true, false, "editPay", null, {arr:"p1pay",idx:p._oi}); })}
                      {isA && <button onClick={function(){openPopup("addPay",{currLabel:"\u00a3"},{arr:"p1pay"});}} style={{width:"100%",padding:"10px",marginTop:6,background:"none",border:"1px dashed rgba(201,168,76,0.25)",borderRadius:10,fontSize:11,color:"#A8780C",cursor:"pointer",fontFamily:F2,letterSpacing:1}}>{tr("newPay")}</button>}
                    </div>
                  )}
                </div>
              </div>
            )}

            {p1Kpi === "owe" && (
              <div style={{borderRadius:20,overflow:"hidden",marginBottom:20,border:"2px solid "+FUND_COL+"40",animation:"fadeUp 0.3s ease"}}>
                <div style={{background:FUND_COL,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div><div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.6)"}}>{tr("phase1")+" \u2014 "+tr("totalOwe")}</div><div style={{fontFamily:F1,fontSize:22,fontWeight:300,color:"#fff"}}>{FUND_SETTLED ? tr(FUND_SETTLED) : fB(TP1-PD1)}</div></div>
                </div>
                <div style={{background:"#FDFAF4",padding:"14px 18px",display:"flex",flexDirection:"column",gap:12}}>
                  <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(128,66,24,0.06)",overflow:"hidden"}}>
                    <div style={{padding:"14px 18px"}}>
                      <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"#9A9A9A",marginBottom:10}}>{tr("fundObl")}</div>
                      {CK.map(function(k,i) {
                        return P1V[i] > 0 ? <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}><span style={{fontSize:11,color:"#6B6B6B"}}><span style={{display:"inline-block",width:8,height:8,borderRadius:4,background:CC[i],marginRight:6}}></span>{cn(i)}</span><span style={{fontSize:11,color:"#6B6B6B"}}>{fB(P1V[i])}</span></div> : null;
                      })}
                      <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 4px",borderTop:"1px dashed rgba(128,66,24,0.12)",marginTop:6}}><span style={{fontSize:11,fontWeight:500,color:"#2C2C2C"}}>{tr("constSub")}</span><span style={{fontSize:11,fontWeight:600,color:"#2C2C2C"}}>{fB(P1C)}</span></div>
                      <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",marginTop:4}}><span style={{fontSize:11,color:"#880E4F"}}>{tr("loanCov")}</span><span style={{fontSize:11,color:"#880E4F"}}>{fB(LT)}</span></div>
                      <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{fontSize:11,color:"#F06292"}}>{"+ "+tr("loanIntCost")}</span><span style={{fontSize:11,color:"#F06292"}}>{fB(LIT)}</span></div>
                      <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 4px",borderTop:"1px dashed rgba(128,66,24,0.12)",marginTop:6}}><span style={{fontSize:11,fontWeight:600,color:"#2C2C2C"}}>{tr("totalObl")}</span><span style={{fontSize:11,fontWeight:700,color:"#2C2C2C"}}>{fB(P1C+LIT)}</span></div>
                      <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 4px",marginTop:6}}><span style={{fontSize:13,fontWeight:600,color:"#27AE60"}}>{"\u2212 "+tr("paidFund")}</span><span style={{fontFamily:F1,fontSize:18,fontWeight:600,color:"#27AE60"}}>{fB(P1PB)}</span></div>
                      <div style={{padding:"10px 0 4px",borderTop:"2px solid #2C2C2C",marginTop:6}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:13,fontWeight:600,color:"#2C2C2C"}}>{tr("totalFunded")}</span><span style={{fontFamily:F1,fontSize:18,color:"#2C2C2C"}}>{fB(P1PB)+" / "+fB(P1C+LIT)}</span></div>
                        {fundBar(P1PB, P1C+LIT, FUND_COL)}
                        <div style={{marginTop:12}}>
                          {FUND_PCT>100 ? <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}><div style={{fontSize:13,fontWeight:600,color:"#8E44AD"}}>{tr("overFunded")}</div><div style={{fontFamily:F1,fontSize:32,fontWeight:300,color:"#8E44AD"}}>{fB(PD1-TP1)}</div></div>
                            : FUND_PCT>=100 ? <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}><div style={{fontSize:13,fontWeight:600,color:"#27AE60"}}>{tr("completed")+" \u2713"}</div></div>
                            : <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}><div style={{fontSize:13,fontWeight:600,color:FUND_COL}}>{tr("stillOwe")}</div><div style={{fontFamily:F1,fontSize:32,fontWeight:300,color:FUND_COL}}>{fB(P1C+LIT-P1PB)}</div></div>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(128,66,24,0.06)",overflow:"hidden"}}>
                    <div style={{padding:"14px 18px"}}>
                      <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"#9A9A9A",marginBottom:10}}>{tr("fundAlloc")}</div>
                      <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 10px"}}><span style={{fontSize:13,fontWeight:600,color:"#27AE60"}}>{tr("paidFund")}</span><span style={{fontFamily:F1,fontSize:18,fontWeight:600,color:"#27AE60"}}>{fB(P1PB)}</span></div>
                      <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderTop:"1px solid rgba(128,66,24,0.06)",paddingTop:8}}><span style={{fontSize:11,color:"#804218"}}>{tr("allocConst")}</span><span style={{fontSize:11,color:"#804218"}}>{fB(P1PB-LCP-LIP)}</span></div>
                      {LOANS.map(function(ln,j) {
                        var lnTotal = (ln.cp||0)+(ln.ip||0);
                        return lnTotal > 0 ? <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{fontSize:11,color:"#880E4F"}}>{tl(ln,"t")}</span><span style={{fontSize:11,color:"#880E4F"}}>{fB(lnTotal)}</span></div> : null;
                      })}
                      <div style={{marginTop:10}}>
                        {LOANS.map(function(ln,j) {
                          var lnCap = ln.a||0; var lnPaid = (ln.cp||0)+(ln.ip||0); var lnTotal = lnCap+(ln.i||0);
                          return <div key={j} style={{marginBottom:8}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:9,letterSpacing:1,textTransform:"uppercase",color:"#9A9A9A"}}>{tl(ln,"t")}</span><span style={{fontSize:9,color:"#9A9A9A"}}>{fB(lnPaid)} / {fB(lnTotal)}</span></div>
                            {progressBar(lnPaid, lnTotal, "#880E4F")}
                          </div>;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ PHASE 2 ═══ */}
        {p2Open && (
          <div style={{animation:"fadeUp 0.3s ease",marginBottom:24}}>
            {/* T1: Interactive KPIs */}
            <div style={{display:"flex",gap:8,marginBottom:20}}>
              {[
                {id:"total",label:tr("totalP2"),vB:P2T,vG:undefined,color:"#62300F",accent:"#62300F"},
                {id:"paid",label:tr("totalPaid"),vB:P2PD,vG:undefined,color:"#C9A84C",accent:"#C9A84C"},
                {id:"owe",label:tr("phase2"),label2:tr("balance"),vB:RM2,vG:undefined,color:P2_COL,accent:P2_COL,settled:P2_SETTLED}
              ].map(function(k) {
                var isActive = k.id && p2Kpi === k.id;
                return (
                  <div key={k.label} onClick={k.id ? function(){setP2Kpi(function(prev){return prev===k.id?null:k.id;});setBruPayOpen(false);setNatPayOpen(false);setP2Panel(null);setP2SetStg(null);setP2BreakOpen(false);setHouseOpen(false);setHouseBreakOpen(false);setHouseKpi(null);} : undefined}
                    style={{flex:1,background:"#fff",borderRadius:14,padding:"14px 10px",textAlign:"center",cursor:k.id?"pointer":"default",border:isActive?"2px solid "+k.accent:"1px solid rgba(128,66,24,0.06)",transition:"all 0.2s",transform:isActive?"scale(1.02)":"none",boxShadow:isActive?"0 4px 20px rgba(201,168,76,0.15)":"0 2px 20px rgba(44,44,44,0.04)"}}>
                    <div style={{width:24,height:3,borderRadius:2,background:k.accent,margin:"0 auto 8px",opacity:isActive?1:0.4,transition:"opacity 0.2s"}} />
                    <div style={{fontSize:9,letterSpacing:1.5,textTransform:"uppercase",color:"#9A9A9A",marginBottom:k.label2?2:4}}>{k.label}</div>
                    {k.label2 && <div style={{fontSize:8,letterSpacing:1,textTransform:"uppercase",color:"#B0B0B0",marginBottom:4}}>{k.label2}</div>}
                    <div style={{fontFamily:F1,fontSize:18,fontWeight:300,color:k.color}}>{k.settled ? tr(k.settled) : fB(k.vB)}</div>
                    {k.vG !== undefined && <div style={{fontSize:10,color:"#9A9A9A",marginTop:4}}>{fG(k.vG)}</div>}
                  </div>
                );
              })}
            </div>

            {/* Panel: Breakdown (from Total P2 KPI) - brown themed, stage cards */}
            {p2Kpi === "total" && (
              <div style={{animation:"fadeUp 0.3s ease"}}>
              <div style={{borderRadius:20,overflow:"hidden",marginBottom:20,border:"2px solid rgba(98,48,15,0.2)"}}>
                <div onClick={function(){setP2BreakOpen(!p2BreakOpen);}} style={{background:"linear-gradient(135deg,#4E2210,#6B3012)",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
                  <div><div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(232,208,138,0.5)"}}>{tr("p2Break")}</div><div style={{fontFamily:F1,fontSize:22,fontWeight:300,color:"#E8D08A"}}>{fB(P2T)}</div></div>
                  <span style={{fontSize:12,color:"rgba(232,208,138,0.5)",transition:"transform 0.3s",transform:p2BreakOpen?"rotate(180deg)":""}}>&#9660;</span>
                </div>
                {p2BreakOpen && (
                <div style={{background:"#FBF7F0",padding:"16px",display:"flex",flexDirection:"column",gap:10}}>
                  {/* P2 Breakdown Donut */}
                  <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(98,48,15,0.06)",padding:"20px 18px"}}>
                    {donut(
                      (MB>0?[{v:MB,c:"#1ABC9C"}]:[]).concat(STAGES.map(function(s){return {v:s.brl,c:s.color};})),
                      160, 20,
                      <div><div style={{fontFamily:F1,fontSize:20,fontWeight:300,color:"#62300F"}}>{fB(P2T)}</div><div style={{fontSize:8,color:"#9A9A9A",letterSpacing:1}}>{tr("totalWord")}</div></div>
                    )}
                    <div style={{marginTop:14,display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"8px 16px"}}>
                      {MB>0 && <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:"50%",background:"#1ABC9C"}} /><span style={{fontSize:10,color:"#6B6B6B"}}>{tr("mentor")+" "+Math.round(MB/P2T*100)+"%"}</span></div>}
                      {STAGES.map(function(stg,i){return stg.brl>0?<div key={i} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:"50%",background:stg.color}} /><span style={{fontSize:10,color:"#6B6B6B"}}>{tl(stg,"t")+" "+Math.round(stg.brl/P2T*100)+"%"}</span></div>:null;})}
                    </div>
                  </div>
                  <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(98,48,15,0.08)",overflow:"hidden"}}>
                    <SwipeRow deleteLabel={tr("delBtn")} enabled={isA} itemName={tr("mentor")} onDelete={function(){confirmDel(tr("mentor"),function(){setMent([]);_saveLS({ment:[]});});}}>
                      <div onClick={function(){setStageOpen(stageOpen==="s0"?null:"s0");}}
                        onMouseDown={isA?function(e){lpStart("editStage",{name:tr("mentor"),color:"#1ABC9C"},e);}:undefined} onMouseMove={isA?lpMove:undefined} onMouseUp={isA?lpEnd:undefined} onMouseLeave={isA?lpEnd:undefined}
                        onTouchStart={isA?function(e){lpStart("editStage",{name:tr("mentor"),color:"#1ABC9C"},e);}:undefined} onTouchMove={isA?lpMove:undefined} onTouchEnd={isA?lpEnd:undefined}
                        style={{padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"box-shadow 0.2s"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:8,height:8,borderRadius:"50%",background:"#1ABC9C",flexShrink:0}} />
                          <div>
                            <div style={{fontSize:10,color:"#9A9A9A",letterSpacing:1}}>{tr("stageLabel") + " 0"}</div>
                            <div style={{fontSize:13,fontWeight:500}}>{tr("mentor")}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{fontFamily:F1,fontSize:16,color:"#62300F"}}>{fB(MB)}</div>
                          <span style={{fontSize:12,color:"#9A9A9A",transition:"transform 0.3s",transform:stageOpen==="s0"?"rotate(180deg)":""}}>&#9660;</span>
                        </div>
                      </div>
                    </SwipeRow>
                    {stageOpen === "s0" && (
                      <div style={{padding:"0 18px 14px",animation:"fadeUp 0.2s ease"}}>
                        <div style={{padding:"16px 0 12px"}}>
                          {donut(MENT.map(function(m,i) { return {v:m.b,c:["#1ABC9C","#16A085","#0E8C73"][i]}; }), 120, 16,
                            <div><div style={{fontFamily:F1,fontSize:18,fontWeight:300,color:"#62300F"}}>{fB(MB)}</div><div style={{fontSize:8,color:"#9A9A9A",letterSpacing:1}}>{tr("totalWord")}</div></div>
                          )}
                        </div>
                        {_dsort(MENT).map(function(m) { return lineItem(m, "#1ABC9C", false, false, "editItem", null, {arr:"ment",idx:m._oi}); })}
                        {isA && <button onClick={function(){openPopup("addItem",{},{arr:"ment"});}} style={{width:"100%",padding:"10px",marginTop:6,background:"none",border:"1px dashed rgba(98,48,15,0.12)",borderRadius:10,fontSize:11,color:"#804218",cursor:"pointer",fontFamily:F2,letterSpacing:1}}>{tr("newItem")}</button>}
                      </div>
                    )}
                  </div>
                  {/* Stages 1-5: Construction */}
                  {STAGES.map(function(stg, si) {
                    var sKey = "s" + (si + 1);
                    var isStgOpen = stageOpen === sKey;
                    var stageCats = stg.cats.map(function(c, ci) { return {id:c.id, name:c.name||cn(ci), color:c.color, brl:c.brl, gbp:c.gbp, items:c.items||[]}; });
                    var stgData = {t:stg.t,t_pt:stg.t_pt,t_de:stg.t_de,name:tl(stg,"t"),color:stg.color,startDate:stg.startDate||"",endDate:stg.endDate||""};
                    return (
                      <div key={si}>
                        <SwipeRow deleteLabel={tr("delBtn")} enabled={isA} itemName={tl(stg,"t")} onDelete={function(){confirmDel(tl(stg,"t"),function(){var snapM=_cloneDeep(p2Meta);var snapI=_cloneDeep(p2Items);undoFn.current=function(){setP2Meta(snapM);setP2Items(snapI);_saveLS({p2meta:snapM,p2items:snapI});};var nm=_cloneDeep(p2Meta);nm.splice(si,1);setP2Meta(nm);var ni=_cloneDeep(p2Items);ni.splice(si,1);setP2Items(ni);_saveLS({p2meta:nm,p2items:ni});});}}>
                      <div
                            onClick={function(){setStageOpen(isStgOpen?null:sKey);}}
                            onMouseDown={isA?function(e){lpStart("editStage",stgData,e,{phase:"p2",idx:si});}:undefined} onMouseMove={isA?lpMove:undefined} onMouseUp={isA?lpEnd:undefined} onMouseLeave={isA?lpEnd:undefined}
                            onTouchStart={isA?function(e){lpStart("editStage",stgData,e,{phase:"p2",idx:si});}:undefined} onTouchMove={isA?lpMove:undefined} onTouchEnd={isA?lpEnd:undefined}
                            style={{padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"box-shadow 0.2s"}}>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <div style={{width:8,height:8,borderRadius:"50%",background:stg.color,flexShrink:0}} />
                              <div>
                                <div style={{fontSize:10,color:"#9A9A9A",letterSpacing:1}}>{tr("stageLabel") + " " + (si + 1)}</div>
                                <div style={{fontSize:13,fontWeight:500}}>{tl(stg,"t")}</div>
                              </div>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <div style={{textAlign:"right"}}>
                                <div style={{fontFamily:F1,fontSize:16,color:stg.color}}>{fB(stg.brl)}</div>
                              </div>
                              <span style={{fontSize:12,color:"#9A9A9A",transition:"transform 0.3s",transform:isStgOpen?"rotate(180deg)":""}}>&#9660;</span>
                            </div>
                          </div>
                        </SwipeRow>
                        {isStgOpen && (
                          <div style={{padding:"0 4px 8px",animation:"fadeUp 0.2s ease"}}>
                            <div style={{padding:"16px 14px 12px"}}>
                              {donut(stageCats.map(function(c) { return {v:c.brl,c:c.color}; }), 120, 16,
                                <div><div style={{fontFamily:F1,fontSize:18,fontWeight:300,color:stg.color}}>{fB(stg.brl)}</div><div style={{fontSize:8,color:"#9A9A9A",letterSpacing:1}}>{tr("totalWord")}</div></div>
                              )}
                            </div>
                            {catList(stageCats, "stg"+si+"_", false, {arr:"p2items",stgIdx:si})}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {isA && <button onClick={function(){openPopup("addStage",{},{phase:"p2"});}} style={{width:"100%",padding:"14px 20px",marginTop:2,background:"none",border:"2px dashed rgba(98,48,15,0.15)",borderRadius:14,fontSize:12,color:"#804218",cursor:"pointer",fontFamily:F2,letterSpacing:1}}>{tr("newStage")}</button>}
                </div>
                )}
              </div>

              {/* ═══ BRUNO HOUSE (inside Total P2 KPI panel) ═══ */}
              <div style={{borderRadius:20,overflow:"hidden",border:"2px solid rgba(98,48,15,0.2)",animation:"fadeUp 0.3s ease"}}>
                <div onClick={function(){setHouseOpen(!houseOpen);if(!houseOpen)setHouseKpi(null);}} style={{background:"linear-gradient(135deg,#4E2210,#6B3012)",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
                  <div><div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(232,208,138,0.5)"}}>{tr("brunoHouse")}</div><div style={{fontFamily:F1,fontSize:22,fontWeight:300,color:"#E8D08A"}}>{fB(HCT)}</div></div>
                  <span style={{fontSize:12,color:"rgba(232,208,138,0.5)",transition:"transform 0.3s",transform:houseOpen?"rotate(180deg)":""}}>&#9660;</span>
                </div>
                {houseOpen && (
                <div style={{background:"#FBF7F0",padding:"16px 16px 20px"}}>
                  <div style={{fontSize:11,fontStyle:"italic",color:"#9A9A9A",marginBottom:14,textAlign:"center"}}>{tr("indTrack")}</div>
                  <div style={{display:"flex",gap:8,marginBottom:16}}>
                    {[
                      {id:"hTotal",label:tr("houseCosts"),vB:HCT,color:"#62300F",accent:"#62300F"},
                      {id:"hPaid",label:tr("housePdIn"),vB:HPD,color:"#C9A84C",accent:"#C9A84C"},
                      {id:"hOwe",label:tr("brunoHouse"),label2:tr("balance"),vB:Math.abs(HRM),color:H_COL,accent:H_COL,settled:H_SETTLED}
                    ].map(function(k) {
                      var isActive = k.id && houseKpi === k.id;
                      return (
                        <div key={k.label} onClick={k.id ? function(){setHouseKpi(houseKpi===k.id?null:k.id);} : undefined}
                          style={{flex:1,background:"#fff",borderRadius:14,padding:"14px 10px",textAlign:"center",cursor:k.id?"pointer":"default",border:isActive?"2px solid "+k.accent:"1px solid rgba(128,66,24,0.06)",transition:"all 0.2s",transform:isActive?"scale(1.02)":"none",boxShadow:isActive?"0 4px 20px rgba(201,168,76,0.15)":"0 2px 20px rgba(44,44,44,0.04)"}}>
                          <div style={{width:24,height:3,borderRadius:2,background:k.accent,margin:"0 auto 8px",opacity:isActive?1:0.4,transition:"opacity 0.2s"}} />
                          <div style={{fontSize:9,letterSpacing:1.5,textTransform:"uppercase",color:"#9A9A9A",marginBottom:k.label2?2:4}}>{k.label}</div>
                          {k.label2 && <div style={{fontSize:8,letterSpacing:1,textTransform:"uppercase",color:"#B0B0B0",marginBottom:4}}>{k.label2}</div>}
                          <div style={{fontFamily:F1,fontSize:18,fontWeight:300,color:k.color}}>{k.settled ? tr(k.settled) : fB(k.vB)}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* House Breakdown (tap House Costs) */}
                  {houseKpi === "hTotal" && (
                    <div style={{borderRadius:20,overflow:"hidden",marginBottom:4,border:"2px solid rgba(98,48,15,0.2)",animation:"fadeUp 0.3s ease"}}>
                      <div onClick={function(){setHouseBreakOpen(!houseBreakOpen);}} style={{background:"linear-gradient(135deg,#4E2210,#6B3012)",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
                        <div><div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(232,208,138,0.5)"}}>{tr("houseBreak")}</div><div style={{fontFamily:F1,fontSize:22,fontWeight:300,color:"#E8D08A"}}>{fB(HCT)}</div></div>
                        <span style={{fontSize:12,color:"rgba(232,208,138,0.5)",transition:"transform 0.3s",transform:houseBreakOpen?"rotate(180deg)":""}}>&#9660;</span>
                      </div>
                      {houseBreakOpen && (
                      <div style={{background:"#FBF7F0",padding:"16px",display:"flex",flexDirection:"column",gap:10}}>
                        {/* House Donut */}
                        <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(98,48,15,0.06)",padding:"20px 18px"}}>
                          {donut(
                            H_STAGES.map(function(s){return {v:s.brl,c:s.color};}),
                            160, 20,
                            <div><div style={{fontFamily:F1,fontSize:20,fontWeight:300,color:"#62300F"}}>{fB(HCT)}</div><div style={{fontSize:8,color:"#9A9A9A",letterSpacing:1}}>{tr("totalWord")}</div></div>
                          )}
                          <div style={{marginTop:14,display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"8px 16px"}}>
                            {H_STAGES.map(function(stg,i){return stg.brl>0?<div key={i} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:"50%",background:stg.color}} /><span style={{fontSize:10,color:"#6B6B6B"}}>{tl(stg,"t")+(HCT>0?" "+Math.round(stg.brl/HCT*100)+"%":"")}</span></div>:null;})}
                          </div>
                        </div>
                        {/* Stage cards */}
                        {H_STAGES.map(function(stg, si) {
                          var sKey = "h" + si;
                          var isHStgOpen = houseStgOpen === sKey;
                          var hStageCats = stg.cats.map(function(c, ci) { return {id:c.id, name:c.name||cn(ci), color:c.color, brl:c.brl, items:c.items||[]}; });
                          var stgData = {t:stg.t,t_pt:stg.t_pt,t_de:stg.t_de,name:tl(stg,"t"),color:stg.color,startDate:stg.startDate||"",endDate:stg.endDate||""};
                          return (
                            <div key={sKey} style={{background:"#fff",borderRadius:14,border:"1px solid rgba(98,48,15,0.08)",overflow:"hidden"}}>
                              <SwipeRow deleteLabel={tr("delBtn")} enabled={isA} itemName={tl(stg,"t")} onDelete={function(){confirmDel(tl(stg,"t"),function(){_deleteFromCtx({arr:"hmeta",idx:si});});}}>
                                <div onClick={function(){setHouseStgOpen(isHStgOpen?null:sKey);}}
                                  onMouseDown={isA?function(e){lpStart("editStage",stgData,e,{phase:"house",idx:si});}:undefined} onMouseMove={isA?lpMove:undefined} onMouseUp={isA?lpEnd:undefined} onMouseLeave={isA?lpEnd:undefined}
                                  onTouchStart={isA?function(e){lpStart("editStage",stgData,e,{phase:"house",idx:si});}:undefined} onTouchMove={isA?lpMove:undefined} onTouchEnd={isA?lpEnd:undefined}
                                  style={{padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"box-shadow 0.2s"}}>
                                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                                    <div style={{width:8,height:8,borderRadius:"50%",background:stg.color,flexShrink:0}} />
                                    <div>
                                      <div style={{fontSize:10,color:"#9A9A9A",letterSpacing:1}}>{tr("stageLabel") + " " + (si + 1)}</div>
                                      <div style={{fontSize:13,fontWeight:500}}>{tl(stg,"t")}</div>
                                    </div>
                                  </div>
                                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                                    <div style={{fontFamily:F1,fontSize:16,color:stg.color}}>{fB(stg.brl)}</div>
                                    <span style={{fontSize:12,color:"#9A9A9A",transition:"transform 0.3s",transform:isHStgOpen?"rotate(180deg)":""}}>&#9660;</span>
                                  </div>
                                </div>
                              </SwipeRow>
                              {isHStgOpen && (
                                <div style={{padding:"0 4px 8px",animation:"fadeUp 0.2s ease"}}>
                                  <div style={{padding:"16px 14px 12px"}}>
                                    {donut(hStageCats.map(function(c) { return {v:c.brl,c:c.color}; }), 120, 16,
                                      <div><div style={{fontFamily:F1,fontSize:18,fontWeight:300,color:stg.color}}>{fB(stg.brl)}</div><div style={{fontSize:8,color:"#9A9A9A",letterSpacing:1}}>{tr("totalWord")}</div></div>
                                    )}
                                  </div>
                                  {catList(hStageCats, "hstg"+si+"_", false, {arr:"hitems",stgIdx:si})}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {isA && <button onClick={function(){openPopup("addStage",{},{phase:"house"});}} style={{width:"100%",padding:"14px 20px",marginTop:2,background:"none",border:"2px dashed rgba(98,48,15,0.15)",borderRadius:14,fontSize:12,color:"#804218",cursor:"pointer",fontFamily:F2,letterSpacing:1}}>{tr("newStage")}</button>}
                      </div>
                      )}
                    </div>
                  )}

                  {/* House Payments (tap Paid In) */}
                  {houseKpi === "hPaid" && (
                    <div style={{animation:"fadeUp 0.2s ease"}}>
                      {card(<div>
                        <div style={{background:"linear-gradient(135deg,#A8780C,#C9A84C)",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                          <div><div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.6)"}}>{tr("housePay")}</div><div style={{fontFamily:F1,fontSize:18,fontWeight:300,color:"#fff"}}>{fB(HPD)}</div></div>
                        </div>
                        <div style={{padding:"12px 20px 16px"}}>
                          {_dsort(H_PAY).map(function(p) { return lineItem(p, "#C9A84C", true, false, "editPay", null, {arr:"hPay",idx:p._oi}); })}
                          {isA && <button onClick={function(){openPopup("addPay",{currLabel:"\u00a3"},{arr:"hPay"});}} style={{width:"100%",padding:"10px",marginTop:6,background:"none",border:"1px dashed rgba(201,168,76,0.25)",borderRadius:10,fontSize:11,color:"#A8780C",cursor:"pointer",fontFamily:F2,letterSpacing:1}}>{tr("newPay")}</button>}
                        </div>
                      </div>)}
                    </div>
                  )}

                  {/* House Balance (tap Balance KPI) */}
                  {houseKpi === "hOwe" && (
                    <div style={{borderRadius:20,overflow:"hidden",marginBottom:4,border:"2px solid "+H_COL+"40",animation:"fadeUp 0.3s ease"}}>
                      <div style={{background:H_COL,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div>
                          <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.6)"}}>{tr("brunoHouse")+" \u2014 "+tr("totalOwe")}</div>
                          <div style={{fontFamily:F1,fontSize:22,fontWeight:300,color:"#fff"}}>{H_SETTLED ? tr(H_SETTLED) : fB(HRM)}</div>
                        </div>
                      </div>
                      <div style={{background:"#FDFAF4",padding:"14px 18px",display:"flex",flexDirection:"column",gap:12}}>
                        {/* Card 1: Financial Breakdown */}
                        <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(128,66,24,0.06)",overflow:"hidden"}}>
                          <div style={{padding:"14px 18px"}}>
                            <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"#9A9A9A",marginBottom:10}}>{tr("fundObl")}</div>
                            {H_STAGES.map(function(stg,i) {
                              return stg.brl > 0 ? <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}><span style={{fontSize:11,color:"#6B6B6B"}}><span style={{display:"inline-block",width:8,height:8,borderRadius:4,background:stg.color,marginRight:6}}></span>{tl(stg,"t")}</span><span style={{fontSize:11,color:"#6B6B6B"}}>{fB(stg.brl)}</span></div> : null;
                            })}
                            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 4px",borderTop:"1px dashed rgba(128,66,24,0.12)",marginTop:6}}>
                              <span style={{fontSize:11,fontWeight:600,color:"#2C2C2C"}}>{tr("totalObl")}</span>
                              <span style={{fontSize:11,fontWeight:700,color:"#2C2C2C"}}>{fB(HCT)}</span>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 4px",marginTop:6}}>
                              <span style={{fontSize:13,fontWeight:600,color:"#27AE60"}}>{"\u2212 "+tr("totalFunded")}</span>
                              <span style={{fontFamily:F1,fontSize:18,fontWeight:600,color:"#27AE60"}}>{fB(HPD)}</span>
                            </div>
                            <div style={{padding:"10px 0 4px",borderTop:"2px solid #2C2C2C",marginTop:6}}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                                <span style={{fontSize:13,fontWeight:600,color:"#2C2C2C"}}>{tr("totalFunded")}</span>
                                <span style={{fontFamily:F1,fontSize:18,color:"#2C2C2C"}}>{fB(HPD)+" / "+fB(HCT)}</span>
                              </div>
                              {fundBar(HPD, HCT, H_COL)}
                              <div style={{marginTop:12}}>
                                {H_PCT>100
                                  ? <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}><div style={{fontSize:13,fontWeight:600,color:"#8E44AD"}}>{tr("overFunded")}</div><div style={{fontFamily:F1,fontSize:32,fontWeight:300,color:"#8E44AD"}}>{fB(HPD-HCT)}</div></div>
                                  : H_PCT>=100
                                    ? <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}><div style={{fontSize:13,fontWeight:600,color:"#27AE60"}}>{tr("completed")+" \u2713"}</div></div>
                                    : <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}><div style={{fontSize:13,fontWeight:600,color:H_COL}}>{tr("stillOwe")}</div><div style={{fontFamily:F1,fontSize:32,fontWeight:300,color:H_COL}}>{fB(HRM)}</div></div>}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Card 2: Payment Allocation */}
                        <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(128,66,24,0.06)",overflow:"hidden"}}>
                          <div style={{padding:"14px 18px"}}>
                            <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"#9A9A9A",marginBottom:10}}>{tr("fundAlloc")}</div>
                            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 10px"}}>
                              <span style={{fontSize:13,fontWeight:600,color:"#27AE60"}}>{tr("paidFund")}</span>
                              <span style={{fontFamily:F1,fontSize:18,fontWeight:600,color:"#27AE60"}}>{fB(HPD)}</span>
                            </div>
                            <div style={{borderTop:"1px solid rgba(128,66,24,0.06)",paddingTop:8}}>
                              {H_PAY.map(function(p,i) {
                                return <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}>
                                  <span style={{fontSize:11,color:"#6B6B6B"}}>{tl(p,"t")}</span>
                                  <span style={{fontSize:11,color:"#804218"}}>{fB(p.b)}</span>
                                </div>;
                              })}
                            </div>
                            {HPD > 0 && HCT > 0 && <div style={{marginTop:10}}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                                <span style={{fontSize:9,letterSpacing:1,textTransform:"uppercase",color:"#9A9A9A"}}>{tr("housePay")}</span>
                                <span style={{fontSize:9,color:"#9A9A9A"}}>{Math.round(Math.min(HPD/HCT,1)*100)+"%"}</span>
                              </div>
                              {progressBar(HPD, HCT, "#804218")}
                            </div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                )}
              </div>
              </div>
            )}

            {/* Panel: Contributions (from Total Paid In KPI) - gold themed */}
            {p2Kpi === "paid" && (
              <div style={{borderRadius:20,overflow:"hidden",marginBottom:20,border:"2px solid rgba(201,168,76,0.25)",animation:"fadeUp 0.3s ease"}}>
                <div style={{background:"linear-gradient(135deg,#C9A84C,#A8780C)",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div><div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.6)"}}>{tr("settle")}</div><div style={{fontFamily:F1,fontSize:22,fontWeight:300,color:"#fff"}}>{fB(P2PD)}</div></div>
                </div>
                <div style={{background:"#FFFDF7",padding:"16px"}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
                    {[
                      {id:"p2cost",l:tr("constCost"),v:fB(P2C),v2:null,ac:"#C0392B"},
                      {id:"p2bru",l:tr("bruPay"),v:fB(B2B),v2:fG(B2G),ac:"#27AE60"},
                      {id:"p2nat",l:tr("natPay"),v:fB(N2B),v2:fE(N2E),ac:"#3498DB"}
                    ].map(function(p) {
                      return (
                        <button key={p.id} onClick={function(){setP2Panel(p2Panel===p.id?null:p.id);}} style={{background:p2Panel===p.id?"#fff":"#FDFAF4",border:p2Panel===p.id?"2px solid "+p.ac:"1px solid rgba(128,66,24,0.08)",borderRadius:16,padding:"16px 14px",cursor:"pointer",textAlign:"left",fontFamily:F2,transition:"all 0.25s"}}>
                          <div style={{fontSize:11,fontWeight:500,marginBottom:8}}>{p.l}</div>
                          <div style={{fontFamily:F1,fontSize:18,fontWeight:300,color:p.ac}}>{p.v}</div>
                          {p.v2 && <div style={{fontSize:10,color:"#9A9A9A",marginTop:2}}>{p.v2}</div>}
                        </button>
                      );
                    })}
                  </div>

                  {p2Panel === "p2cost" && (
                    <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(128,66,24,0.06)",overflow:"hidden",marginBottom:12,animation:"fadeUp 0.2s ease"}}>
                      <div style={{padding:"12px 18px",borderBottom:"1px solid rgba(128,66,24,0.06)"}}><div style={{fontSize:11,fontWeight:600,color:"#C0392B"}}>{tr("constCost")}</div></div>
                      <div style={{padding:"8px 0"}}>
                        {STAGES.map(function(stg, si) {
                          var isStgOpen2 = p2SetStg === "ss"+si;
                          var sCats = stg.cats.map(function(c, ci) { return {id:c.id, name:c.name||cn(ci), color:c.color, brl:c.brl, items:c.items||[]}; });
                          return (
                            <div key={si}>
                              <div onClick={function(){setP2SetStg(isStgOpen2?null:"ss"+si);}} style={{display:"flex",alignItems:"center",padding:"10px 18px",cursor:"pointer",gap:10,borderBottom:"1px solid rgba(128,66,24,0.04)"}}>
                                <div style={{width:8,height:8,borderRadius:"50%",background:stg.color,flexShrink:0}} />
                                <div style={{fontSize:12,flex:1}}>{tl(stg,"t")}</div>
                                <div style={{fontSize:12,fontWeight:500}}>{fB(stg.brl)}</div>
                                <div style={{width:16,height:16,borderRadius:"50%",background:"#F5F0E8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#6B6B6B",transition:"transform 0.2s",transform:isStgOpen2?"rotate(180deg)":""}}>&#9662;</div>
                              </div>
                              {isStgOpen2 && (
                                <div style={{padding:"0 4px 8px",animation:"fadeUp 0.2s ease"}}>
                                  {catListRO(sCats, "p2set_s"+si+"_", false)}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <div style={{display:"flex",justifyContent:"space-between",padding:"12px 18px 8px",borderTop:"2px solid #C0392B",marginTop:4}}>
                          <span style={{fontSize:12,fontWeight:600,color:"#C0392B"}}>{tr("totalWord")}</span>
                          <span style={{fontFamily:F1,fontSize:16,color:"#C0392B"}}>{fB(P2C)}</span>
                        </div>
                      </div>
                    </div>
                  )}


                  {p2Panel === "p2bru" && (
                    <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(128,66,24,0.06)",overflow:"hidden",marginBottom:12,animation:"fadeUp 0.2s ease"}}>
                      <div style={{padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(128,66,24,0.06)"}}>
                        <div style={{fontSize:11,fontWeight:600,color:"#27AE60"}}>{tr("bruPay")}</div>
                        <div style={{textAlign:"right"}}><div style={{fontFamily:F1,fontSize:16,color:"#27AE60"}}>{fB(B2B)}</div><div style={{fontSize:10,color:"#9A9A9A"}}>{fG(B2G)}</div></div>
                      </div>
                      <div style={{padding:"8px 18px 14px"}}>
                        {_dsort(BRU2).map(function(p) { return lineItem(p, "#C9A84C", true, false, "editPay", null, {arr:"bru2",idx:p._oi}); })}
                        {isA && <button onClick={function(){openPopup("addPay",{currLabel:"\u00a3"},{arr:"bru2"});}} style={{width:"100%",padding:"10px",marginTop:6,background:"none",border:"1px dashed rgba(201,168,76,0.25)",borderRadius:10,fontSize:11,color:"#A8780C",cursor:"pointer",fontFamily:F2,letterSpacing:1}}>{tr("newPay")}</button>}
                      </div>
                    </div>
                  )}

                  {p2Panel === "p2nat" && (
                    <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(128,66,24,0.06)",overflow:"hidden",marginBottom:12,animation:"fadeUp 0.2s ease"}}>
                      <div style={{padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(128,66,24,0.06)"}}>
                        <div style={{fontSize:11,fontWeight:600,color:"#3498DB"}}>{tr("natPay")}</div>
                        <div style={{textAlign:"right"}}><div style={{fontFamily:F1,fontSize:16,color:"#3498DB"}}>{fB(N2B)}</div><div style={{fontSize:10,color:"#9A9A9A"}}>{fE(N2E)}</div></div>
                      </div>
                      <div style={{padding:"8px 18px 14px"}}>
                        {_dsort(NAT2).map(function(p) { return lineItem(p, "#3498DB", false, true, "editPay", null, {arr:"nat2",idx:p._oi}); })}
                        {isA && <button onClick={function(){openPopup("addPay",{currLabel:"\u20ac"},{arr:"nat2"});}} style={{width:"100%",padding:"10px",marginTop:6,background:"none",border:"1px dashed rgba(201,168,76,0.25)",borderRadius:10,fontSize:11,color:"#A8780C",cursor:"pointer",fontFamily:F2,letterSpacing:1}}>{tr("newPay")}</button>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {p2Kpi === "owe" && (
              <div style={{borderRadius:20,overflow:"hidden",marginBottom:20,border:"2px solid "+P2_COL+"40",animation:"fadeUp 0.3s ease"}}>
                <div style={{background:P2_COL,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div><div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.6)"}}>{tr("phase2")+" \u2014 "+tr("totalOwe")}</div><div style={{fontFamily:F1,fontSize:22,fontWeight:300,color:"#fff"}}>{P2_SETTLED ? tr(P2_SETTLED) : fB(RM2)}</div></div>
                </div>
                <div style={{background:"#FDFAF4",padding:"14px 18px",display:"flex",flexDirection:"column",gap:12}}>
                  <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(128,66,24,0.06)",overflow:"hidden"}}>
                    <div style={{padding:"14px 18px"}}>
                      <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"#9A9A9A",marginBottom:10}}>{tr("fundObl")}</div>
                      {STAGES.map(function(stg,i) {
                        return stg.brl > 0 ? <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}><span style={{fontSize:11,color:"#6B6B6B"}}><span style={{display:"inline-block",width:8,height:8,borderRadius:4,background:stg.color,marginRight:6}}></span>{tl(stg,"t")}</span><span style={{fontSize:11,color:"#6B6B6B"}}>{fB(stg.brl)}</span></div> : null;
                      })}
                      <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 4px",borderTop:"1px dashed rgba(128,66,24,0.12)",marginTop:6}}><span style={{fontSize:11,fontWeight:500,color:"#2C2C2C"}}>{tr("constSub")}</span><span style={{fontSize:11,fontWeight:600,color:"#2C2C2C"}}>{fB(P2C)}</span></div>
                      {MB > 0 && <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{fontSize:11,color:"#1ABC9C"}}>{"+ "+tr("mentor")}</span><span style={{fontSize:11,color:"#1ABC9C"}}>{fB(MB)}</span></div>}
                      <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 4px",borderTop:"1px dashed rgba(128,66,24,0.12)",marginTop:6}}><span style={{fontSize:11,fontWeight:600,color:"#2C2C2C"}}>{tr("totalObl")}</span><span style={{fontSize:11,fontWeight:700,color:"#2C2C2C"}}>{fB(P2T)}</span></div>
                      <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 4px",marginTop:6}}><span style={{fontSize:13,fontWeight:600,color:"#27AE60"}}>{"\u2212 "+tr("totalFunded")}</span><span style={{fontFamily:F1,fontSize:18,fontWeight:600,color:"#27AE60"}}>{fB(P2PD)}</span></div>
                      <div style={{padding:"10px 0 4px",borderTop:"2px solid #2C2C2C",marginTop:6}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:13,fontWeight:600,color:"#2C2C2C"}}>{tr("totalFunded")}</span><span style={{fontFamily:F1,fontSize:18,color:"#2C2C2C"}}>{fB(P2PD)+" / "+fB(P2T)}</span></div>
                        {fundBar(P2PD, P2T, P2_COL)}
                        <div style={{marginTop:12}}>
                          {P2_PCT>100 ? <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}><div style={{fontSize:13,fontWeight:600,color:"#8E44AD"}}>{tr("overFunded")}</div><div style={{fontFamily:F1,fontSize:32,fontWeight:300,color:"#8E44AD"}}>{fB(P2PD-P2T)}</div></div>
                            : P2_PCT>=100 ? <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}><div style={{fontSize:13,fontWeight:600,color:"#27AE60"}}>{tr("completed")+" \u2713"}</div></div>
                            : <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}><div style={{fontSize:13,fontWeight:600,color:P2_COL}}>{tr("stillOwe")}</div><div style={{fontFamily:F1,fontSize:32,fontWeight:300,color:P2_COL}}>{fB(RM2)}</div></div>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{background:"#fff",borderRadius:14,border:"1px solid rgba(128,66,24,0.06)",overflow:"hidden"}}>
                    <div style={{padding:"14px 18px"}}>
                      <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"#9A9A9A",marginBottom:10}}>{tr("fundAlloc")}</div>
                      <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 10px"}}><span style={{fontSize:13,fontWeight:600,color:"#27AE60"}}>{tr("totalFunded")}</span><span style={{fontFamily:F1,fontSize:18,fontWeight:600,color:"#27AE60"}}>{fB(P2PD)}</span></div>
                      <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderTop:"1px solid rgba(128,66,24,0.06)",paddingTop:8}}><span style={{fontSize:11,color:"#804218"}}>{tr("bruPay")}</span><span style={{fontSize:11,color:"#804218"}}>{fB(B2B)}</span></div>
                      <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{fontSize:11,color:"#3498DB"}}>{tr("natPay")}</span><span style={{fontSize:11,color:"#3498DB"}}>{fB(N2B)}</span></div>
                      {P2PD > 0 && <div style={{marginTop:10}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:9,letterSpacing:1,textTransform:"uppercase",color:"#9A9A9A"}}>{tr("bruPay")}</span><span style={{fontSize:9,color:"#9A9A9A"}}>{Math.round(B2B/P2PD*100)+"%"}</span></div>
                        {progressBar(B2B, P2PD, "#804218")}
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,marginTop:8}}><span style={{fontSize:9,letterSpacing:1,textTransform:"uppercase",color:"#9A9A9A"}}>{tr("natPay")}</span><span style={{fontSize:9,color:"#9A9A9A"}}>{Math.round(N2B/P2PD*100)+"%"}</span></div>
                        {progressBar(N2B, P2PD, "#3498DB")}
                      </div>}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* AI FAB */}
      {isA && <button onClick={function(){setChatOpen(!chatOpen);}} style={{position:"fixed",bottom:24,right:24,width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#4E2210,#6B3012)",border:"none",cursor:"pointer",boxShadow:"0 6px 24px rgba(98,48,15,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,transition:"all 0.3s",transform:chatOpen?"rotate(45deg) scale(0.9)":"scale(1)"}}><span style={{fontSize:22,color:"#E8D08A"}}>{chatOpen ? "+" : "\u2726"}</span></button>}
      {isA && chatOpen && (
        <div style={{position:"fixed",bottom:92,right:24,width:"min(420px,calc(100vw - 48px))",height:"min(560px,calc(100vh - 140px))",background:"rgba(253,250,244,0.95)",backdropFilter:"blur(30px)",borderRadius:24,border:"1px solid rgba(128,66,24,0.12)",boxShadow:"0 24px 80px rgba(0,0,0,0.15)",display:"flex",flexDirection:"column",overflow:"hidden",zIndex:199,animation:"fadeUp 0.3s ease"}}>
          <div style={{padding:"16px 20px",background:"linear-gradient(135deg,#62300F,#4A2209)",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18}}>&#127793;</span></div>
            <div><div style={{fontSize:13,fontWeight:500,color:"#E8D08A"}}>{tr("aiN")}</div><div style={{fontSize:10,color:"rgba(206,146,98,0.7)"}}>{tr("aiD")}</div></div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{textAlign:"center",color:"#9A9A9A",fontSize:12}}>{tr("soon")}</div></div>
          <div style={{padding:"12px 16px 16px",borderTop:"1px solid rgba(128,66,24,0.06)",display:"flex",gap:8}}>
            <div style={{flex:1,background:"#fff",border:"1px solid rgba(128,66,24,0.1)",borderRadius:14,display:"flex",alignItems:"center",overflow:"hidden"}}>
              <input value={chatIn} onChange={function(e){setChatIn(e.target.value);}} placeholder={tr("aiP")} style={{flex:1,border:"none",outline:"none",padding:"10px 14px",fontSize:13,fontFamily:F2,color:"#2C2C2C",background:"transparent"}} />
            </div>
            <button style={{width:36,height:36,borderRadius:"50%",background:chatIn?"linear-gradient(135deg,#4E2210,#6B3012)":"rgba(128,66,24,0.08)",border:"none",cursor:chatIn?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:14,color:chatIn?"#E8D08A":"#9A9A9A"}}>{"\u2191"}</span></button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:"#62300F",color:"#E8D08A",padding:"12px 24px",borderRadius:14,fontFamily:F2,fontSize:12,boxShadow:"0 6px 24px rgba(0,0,0,0.25)",zIndex:600,display:"flex",alignItems:"center",gap:12,animation:"fadeUp 0.3s ease"}}>
          <span>{toast}</span>
          <button onClick={function(){if(undoFn.current){undoFn.current();undoFn.current=null;}setToast(null);}} style={{background:"rgba(232,208,138,0.15)",border:"none",color:"#E8D08A",padding:"4px 10px",borderRadius:8,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:F2,letterSpacing:1}}>{tr("undo")}</button>
        </div>
      )}

      {/* Modals */}
      {renderPopup()}
      {renderDeleteDialog()}
    </div>
  );
}
