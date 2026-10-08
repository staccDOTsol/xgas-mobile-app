import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Chaininess lives in metadata only (app.json extra.metadataOnly + receipt footers).
// Engine: xgas-mcp — quote_enter / prepare_enter / ramp_quote / quote_exit /
// get_exit_status / list_orders / quote_trade / list_ngu_tokens / quote_ngu_buy.

type Screen = 'home' | 'add' | 'earn' | 'out' | 'act';
const money = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [balance, setBalance] = useState(1240.0);
  const [amt, setAmt] = useState('100');
  const [method, setMethod] = useState<'app' | 'web'>('app');
  const [outAmt, setOutAmt] = useState('250');
  const [rail, setRail] = useState<'bank' | 'x' | 'stay'>('bank');
  const [opt1, setOpt1] = useState(false);
  const [opt2, setOpt2] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [toast, setToast] = useState('');

  const a = Math.max(0, parseFloat(amt) || 0);
  const fee = useMemo(() => (method === 'app' ? a * 0.3 : 0), [a, method]);
  const spicy = opt1 && opt2;

  const say = (t: string) => { setToast(t); setTimeout(() => setToast(''), 3200); };

  return (
    <SafeAreaView style={s.root}>
      <StatusBar style="light" />
      <View style={s.header}>
        <Text style={s.logo}>xgas<Text style={{ color: '#57e6a3' }}>.</Text>dollars</Text>
        <Text style={s.pill}>dollars in · dollars out</Text>
      </View>

      <ScrollView contentContainerStyle={s.body}>
        {screen === 'home' && (
          <>
            <View style={s.hero}>
              <Text style={s.k}>YOUR DOLLARS</Text>
              <Text style={s.bal}>{money(balance)}</Text>
              <Text style={s.yield}>+$12.40 earned · paid in dollars, not points</Text>
              <Text style={s.sub}>Nearly risk-free, dollar-quoted yield on the dollar. Spicier plays exist — they're double opt-in, never default.</Text>
              <View style={s.row}>
                <TouchableOpacity style={[s.btn, s.primary]} onPress={() => setScreen('add')}><Text style={s.primaryTxt}>Add dollars</Text></TouchableOpacity>
                <TouchableOpacity style={[s.btn, s.ghost]} onPress={() => setScreen('out')}><Text style={s.ghostTxt}>Cash out</Text></TouchableOpacity>
              </View>
            </View>

            <View style={s.card}>
              <Text style={s.h3}>Dollar Yield  ·  DEFAULT  ·  target ~4%</Text>
              <Text style={s.muted}>The boring door. Dollars sit in the dollar vault; yield is quoted and paid in dollars. Target, not a guarantee — the receipt shows what's backing every dollar.</Text>
              <TouchableOpacity style={[s.btn, s.ghost, { marginTop: 10 }]} onPress={() => setShowReceipt(!showReceipt)}>
                <Text style={s.ghostTxt}>{showReceipt ? 'Hide' : 'View'} backing receipt</Text>
              </TouchableOpacity>
              {showReceipt && (
                <Text style={s.receipt}>{`metadata · for nerds only\nsettlement: xGas Orbit L4 (466302) ← Robinhood Chain (4663)\nbacking: USDG reserve vault · NAV read in dollars\nfees in/out: 0.01% + 0.01%, shown before you confirm\nengine: xgas-mcp`}</Text>
              )}
            </View>

            <View style={s.card}>
              <Text style={s.h3}>How you get paid out</Text>
              <View style={s.fee}><Text style={s.feeL}>Bank partner (ACH)</Text><Text style={s.feeR}>1–3 days · $0 app fee</Text></View>
              <View style={s.fee}><Text style={s.feeL}>X Money to your handle</Text><Text style={s.feeR}>minutes · receiver confirms</Text></View>
              <View style={s.fee}><Text style={s.feeL}>Keep dollars here</Text><Text style={s.feeR}>keep earning</Text></View>
              <Text style={s.fine}>Payouts leave through the same regulated doors dollars came in. Every cash-out maps to dollars actually held — we never print a payout. Status is honest: requested → ready → sent.</Text>
            </View>
          </>
        )}

        {screen === 'add' && (
          <View style={s.card}>
            <Text style={s.h3}>Add dollars</Text>
            <Text style={s.muted}>Pick how they arrive. The cut — if any — is printed before you pay, never buried.</Text>
            <TextInput style={s.input} keyboardType="numeric" value={amt} onChangeText={setAmt} />
            <View style={s.seg}>
              <TouchableOpacity style={[s.segBtn, method === 'app' && s.segOn]} onPress={() => setMethod('app')}><Text style={s.segTxt}>In this app</Text></TouchableOpacity>
              <TouchableOpacity style={[s.segBtn, method === 'web' && s.segOn]} onPress={() => setMethod('web')}><Text style={s.segTxt}>Web checkout</Text></TouchableOpacity>
            </View>
            <View style={s.fee}><Text style={s.feeL}>You pay</Text><Text style={s.feeR}>{money(a)}</Text></View>
            <View style={s.fee}><Text style={s.feeL}>Convenience fee — cuz app. Paid to Apple/Google.</Text><Text style={[s.feeR, { color: fee ? '#ffb454' : '#eef3ee' }]}>−{money(fee)}</Text></View>
            <View style={s.fee}><Text style={s.feeL}>Dollars that start earning</Text><Text style={[s.feeR, { color: '#57e6a3' }]}>{money(a - fee)}</Text></View>
            <Text style={s.fine}>{method === 'app' ? 'Straight talk: Apple/Google take 30% off the top inside the app. That\'s their convenience fee, not ours.' : 'Web checkout: no Apple/Google cut. All of it starts earning.'}</Text>
            <TouchableOpacity style={[s.btn, s.primary, { marginTop: 12 }]} onPress={() => { setBalance(balance + (a - fee)); say(method === 'app' ? `Added ${money(a - fee)} — Apple/Google kept their 30% convenience fee.` : `Added ${money(a - fee)} — zero app-store cut on web.`); setScreen('home'); }}>
              <Text style={s.primaryTxt}>Add dollars</Text>
            </TouchableOpacity>
          </View>
        )}

        {screen === 'earn' && (
          <>
            <View style={s.card}>
              <Text style={s.h3}>Dollar Yield · ON BY DEFAULT</Text>
              <View style={s.fee}><Text style={s.feeL}>Earning balance</Text><Text style={s.feeR}>{money(balance)}</Text></View>
              <View style={s.fee}><Text style={s.feeL}>Earned so far</Text><Text style={[s.feeR, { color: '#57e6a3' }]}>+$12.40</Text></View>
            </View>
            <View style={s.card}>
              <Text style={s.h3}>Spicier plays · DOUBLE OPT-IN</Text>
              <Text style={s.muted}>Off by default. Worst case printed first, biggest numbers we have.</Text>
              {([['Opt-in 1: I understand these can lose money.', opt1, setOpt1], ['Opt-in 2: Show me the spicy menu anyway.', opt2, setOpt2]] as const).map(([label, val, set], i) => (
                <View key={i} style={s.switchRow}>
                  <Text style={[s.feeL, { flex: 1 }]}>{label}</Text>
                  <TouchableOpacity style={[s.tgl, val && s.tglOn]} onPress={() => set(!val)}><View style={[s.knob, val && s.knobOn]} /></TouchableOpacity>
                </View>
              ))}
              <View style={!spicy && s.locked}>
                <View style={s.fee}><Text style={s.feeL}>Curve plays{'\n'}<Text style={s.fine}>worst case if you sell straight back: 10.02% (max-loss, shown first, always)</Text></Text><Text style={s.feeR}>spicy</Text></View>
                <View style={s.fee}><Text style={s.feeL}>Counterparty desk (P2P){'\n'}<Text style={s.fine}>escrowed on our side; fiat leg is person-to-person, 15-min timeout reclaim</Text></Text><Text style={s.feeR}>spicier</Text></View>
                <TouchableOpacity style={[s.btn, s.ghost, { marginTop: 8 }]} onPress={() => say('Quotes are review-first: exact terms, fees, worst case — then you approve. Nothing auto-executes.')}>
                  <Text style={s.ghostTxt}>Preview a spicy quote</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {screen === 'out' && (
          <View style={s.card}>
            <Text style={s.h3}>Cash out</Text>
            <Text style={s.muted}>Dollars out the same doors they came in. Exact net quoted before you confirm.</Text>
            <TextInput style={s.input} keyboardType="numeric" value={outAmt} onChangeText={setOutAmt} />
            <View style={s.seg}>
              {([['bank', 'Bank · 1–3d'], ['x', 'X Money · mins'], ['stay', 'Stay earning']] as const).map(([r, label]) => (
                <TouchableOpacity key={r} style={[s.segBtn, rail === r && s.segOn]} onPress={() => setRail(r)}><Text style={s.segTxt}>{label}</Text></TouchableOpacity>
              ))}
            </View>
            <View style={s.fee}><Text style={s.feeL}>App fee</Text><Text style={s.feeR}>$0.00</Text></View>
            <View style={s.fee}><Text style={s.feeL}>You receive</Text><Text style={[s.feeR, { color: '#57e6a3' }]}>{rail === 'stay' ? money(balance) + ' (stays)' : money(Math.max(0, parseFloat(outAmt) || 0))}</Text></View>
            <Text style={s.fine}>{rail === 'bank' ? 'Paid by our licensed bank/redemption partner. Honest status: requested → ready → sent.' : rail === 'x' ? 'Escrowed side releases only after the receiver confirms. 15-min timeout reclaim if they ghost.' : 'No payout — balance keeps earning dollar-quoted yield.'}</Text>
            <TouchableOpacity style={[s.btn, s.primary, { marginTop: 12 }]} onPress={() => {
              const o = Math.max(0, parseFloat(outAmt) || 0);
              if (rail === 'stay') return say('Staying put — still earning.');
              if (o > balance) return say(`More than your balance of ${money(balance)}.`);
              setBalance(balance - o); say(`Payout of ${money(o)} requested — requested → ready → sent.`); setScreen('act');
            }}><Text style={s.primaryTxt}>Request payout</Text></TouchableOpacity>
          </View>
        )}

        {screen === 'act' && (
          <View style={s.card}>
            <Text style={s.h3}>Activity</Text>
            <View style={s.fee}><Text style={s.feeL}>Added via web checkout</Text><Text style={s.feeR}>+$500.00</Text></View>
            <View style={s.fee}><Text style={s.feeL}>Dollar yield paid</Text><Text style={[s.feeR, { color: '#57e6a3' }]}>+$12.40</Text></View>
            <View style={s.fee}><Text style={s.feeL}>Payout to bank partner</Text><Text style={s.feeR}>−$250.00 · sent</Text></View>
            <Text style={s.receipt}>{`receipt #1042 · payout\nhuman: $250.00 → bank partner · requested → ready → sent\nmetadata: exit via xgas-mcp (quote_exit · get_exit_status)\nfinality stages shown, never hidden`}</Text>
          </View>
        )}

        <Text style={[s.fine, { textAlign: 'center', marginTop: 16 }]}>Dollars in. Dollars out. Yield in dollars.{'\n'}Target yields are not guarantees; spicy plays can lose money and are double opt-in.</Text>
      </ScrollView>

      {!!toast && <View style={s.toast}><Text style={s.toastTxt}>{toast}</Text></View>}

      <View style={s.nav}>
        {([['home', 'Home'], ['add', 'Add'], ['earn', 'Earn'], ['out', 'Cash out'], ['act', 'Activity']] as [Screen, string][]).map(([k, label]) => (
          <TouchableOpacity key={k} style={[s.navBtn, screen === k && s.navOn]} onPress={() => setScreen(k)}><Text style={[s.navTxt, screen === k && { color: '#eef3ee' }]}>{label}</Text></TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b0f0c' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingTop: 10 },
  logo: { color: '#eef3ee', fontWeight: '800', fontSize: 22, letterSpacing: -0.5 },
  pill: { color: '#9db3a2', fontSize: 12, borderWidth: 1, borderColor: '#223028', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, overflow: 'hidden' },
  body: { padding: 18, paddingBottom: 120 },
  hero: { backgroundColor: '#131a14', borderWidth: 1, borderColor: '#223028', borderRadius: 28, padding: 22 },
  k: { color: '#9db3a2', fontSize: 12, letterSpacing: 1.2 },
  bal: { color: '#eef3ee', fontSize: 50, fontWeight: '800', letterSpacing: -1.5, marginVertical: 6 },
  yield2: {},
  yield: { color: '#57e6a3', fontWeight: '700', fontSize: 16 },
  sub: { color: '#9db3a2', fontSize: 14, marginTop: 12 },
  row: { flexDirection: 'row', gap: 10, marginTop: 18 },
  btn: { flex: 1, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  primary: { backgroundColor: '#57e6a3' },
  primaryTxt: { color: '#06130c', fontWeight: '800', fontSize: 16 },
  ghost: { backgroundColor: '#171d18', borderWidth: 1, borderColor: '#223028' },
  ghostTxt: { color: '#eef3ee', fontWeight: '700', fontSize: 15 },
  card: { backgroundColor: '#121713', borderWidth: 1, borderColor: '#223028', borderRadius: 22, padding: 18, marginTop: 14 },
  h3: { color: '#eef3ee', fontSize: 17, fontWeight: '800', marginBottom: 6 },
  muted: { color: '#9db3a2', fontSize: 14 },
  fee: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 11, borderTopWidth: 1, borderTopColor: '#1c261f' },
  feeL: { color: '#eef3ee', fontSize: 14, flexShrink: 1 },
  feeR: { color: '#eef3ee', fontSize: 14, fontWeight: '700' },
  fine: { color: '#9db3a2', fontSize: 12, lineHeight: 18, marginTop: 8 },
  receipt: { fontFamily: 'Courier', fontSize: 12, color: '#9db3a2', backgroundColor: '#0d120e', borderWidth: 1, borderColor: '#223028', borderRadius: 14, padding: 12, marginTop: 10 },
  input: { backgroundColor: '#171d18', borderWidth: 1, borderColor: '#223028', color: '#eef3ee', borderRadius: 16, padding: 16, fontSize: 24, fontWeight: '700', marginTop: 12 },
  seg: { flexDirection: 'row', backgroundColor: '#171d18', borderWidth: 1, borderColor: '#223028', borderRadius: 16, padding: 4, gap: 4, marginVertical: 12 },
  segBtn: { flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  segOn: { backgroundColor: '#223128' },
  segTxt: { color: '#eef3ee', fontSize: 13, fontWeight: '600' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  tgl: { width: 52, height: 30, borderRadius: 999, backgroundColor: '#263129', borderWidth: 1, borderColor: '#223028', justifyContent: 'center', paddingHorizontal: 3 },
  tglOn: { backgroundColor: '#14532d' },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#8fa596' },
  knobOn: { backgroundColor: '#57e6a3', alignSelf: 'flex-end' },
  locked: { opacity: 0.4 },
  nav: { position: 'absolute', left: 12, right: 12, bottom: 14, flexDirection: 'row', backgroundColor: 'rgba(18,23,19,0.96)', borderWidth: 1, borderColor: '#223028', borderRadius: 24, padding: 6 },
  navBtn: { flex: 1, borderRadius: 18, paddingVertical: 10, alignItems: 'center' },
  navOn: { backgroundColor: '#1d2b21' },
  navTxt: { color: '#9db3a2', fontSize: 12, fontWeight: '600' },
  toast: { position: 'absolute', left: 24, right: 24, bottom: 92, backgroundColor: '#eafff3', borderRadius: 999, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
  toastTxt: { color: '#06130c', fontWeight: '700', fontSize: 14, textAlign: 'center' },
});
