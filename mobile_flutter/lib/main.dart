import 'package:flutter/material.dart';

void main() => runApp(const PulzrApp());

class PulzrColors {
  static const background = Color(0xFF0B0B0C);
  static const card = Color(0xFF1C1C1E);
  static const surface = Color(0xFF242426);
  static const neon = Color(0xFFCCFF00);
  static const text = Colors.white;
  static const muted = Color(0xFF8E8E93);
  static const divider = Color(0x1FFFFFFF);
}

class PulzrApp extends StatelessWidget {
  const PulzrApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'PULZR',
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: PulzrColors.background,
        colorScheme: const ColorScheme.dark(
          primary: PulzrColors.neon,
          surface: PulzrColors.card,
          onPrimary: Colors.black,
          onSurface: PulzrColors.text,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: PulzrColors.background,
          elevation: 0,
          centerTitle: true,
          foregroundColor: PulzrColors.text,
        ),
        textTheme: const TextTheme(
          headlineMedium: TextStyle(color: PulzrColors.text, fontSize: 26, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic),
          titleLarge: TextStyle(color: PulzrColors.text, fontSize: 20, fontWeight: FontWeight.w800),
          titleMedium: TextStyle(color: PulzrColors.text, fontSize: 16, fontWeight: FontWeight.w800),
          bodyMedium: TextStyle(color: PulzrColors.text, fontSize: 14, height: 1.4),
          bodySmall: TextStyle(color: PulzrColors.muted, fontSize: 12, height: 1.3),
        ),
      ),
      home: const PulzrShell(),
    );
  }
}

class Athlete {
  const Athlete(this.name, this.location, this.level, this.avatarUrl, this.streak, this.distance);
  final String name, location, level, avatarUrl, distance;
  final int streak;
}

class Metric {
  const Metric(this.label, this.value);
  final String label, value;
}

class Activity {
  const Activity(this.athlete, this.time, this.imageUrl, this.title, this.caption, this.commentAuthor, this.comment, this.metrics);
  final Athlete athlete;
  final String time, imageUrl, title, caption, commentAuthor, comment;
  final List<Metric> metrics;
}

const mainAthlete = Athlete(
  'Nathalia R.',
  'Sao Paulo, SP',
  'Nivel 18 - Hybrid Athlete',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop',
  6,
  '184.2 km',
);

const feed = [
  Activity(
    mainAthlete,
    'Ha 2h',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&h=900&fit=crop',
    'Leg day controlado',
    'Treino de pernas concluido com foco em forca, volume e consistencia. #PULZR',
    'Alex F.',
    'Monstro. Ritmo forte do inicio ao fim.',
    [Metric('DISTANCIA', '10.5 KM'), Metric('RITMO', '5:09'), Metric('TEMPO', '45:12')],
  ),
  Activity(
    Athlete('Bruno M.', 'Rio de Janeiro, RJ', 'Nivel 14 - Runner', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop', 4, '121.8 km'),
    'Ha 4h',
    'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=900&h=900&fit=crop',
    'Corrida progressiva',
    'Fechando a semana com progressao limpa e ultimo km no limite.',
    'Nathalia R.',
    'Essa subida final cobrou caro.',
    [Metric('DISTANCIA', '7.2 KM'), Metric('PACE', '4:48'), Metric('PULSO', '168 BPM')],
  ),
];

class PulzrShell extends StatefulWidget {
  const PulzrShell({super.key});
  @override
  State<PulzrShell> createState() => _PulzrShellState();
}

class _PulzrShellState extends State<PulzrShell> {
  int index = 0;
  late final screens = const [FeedScreen(), PlaceholderScreen('Desafios', Icons.emoji_events_outlined), LiveActivityScreen(), PlaceholderScreen('Treinos', Icons.fitness_center_rounded), ProfileScreen()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: index, children: screens),
      bottomNavigationBar: PulzrBottomNav(currentIndex: index, onChanged: (value) => setState(() => index = value)),
    );
  }
}

class PulzrWordmark extends StatelessWidget {
  const PulzrWordmark({super.key, this.size = 22});
  final double size;
  @override
  Widget build(BuildContext context) => Text('PULZR', style: TextStyle(color: PulzrColors.text, fontSize: size, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic, letterSpacing: 1.4));
}

class PulzrBoltMark extends StatelessWidget {
  const PulzrBoltMark({super.key, this.size = 52, this.filled = true});
  final double size;
  final bool filled;
  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(color: filled ? PulzrColors.neon : PulzrColors.card, shape: BoxShape.circle, border: filled ? null : Border.all(color: PulzrColors.neon.withOpacity(.65))),
      child: Stack(alignment: Alignment.center, children: [
        Text('P', style: TextStyle(color: filled ? Colors.black : PulzrColors.text, fontSize: size * .47, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic, height: 1)),
        Transform.rotate(angle: .18, child: Icon(Icons.flash_on_rounded, color: filled ? Colors.black : PulzrColors.neon, size: size * .42)),
      ]),
    );
  }
}

class PulzrBottomNav extends StatelessWidget {
  const PulzrBottomNav({super.key, required this.currentIndex, required this.onChanged});
  final int currentIndex;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    final items = [
      (Icons.dynamic_feed_rounded, 'Feed'),
      (Icons.emoji_events_outlined, 'Desafios'),
      (Icons.flash_on_rounded, 'PULZR'),
      (Icons.fitness_center_rounded, 'Treinos'),
      (Icons.person_outline_rounded, 'Perfil'),
    ];
    return Container(
      decoration: const BoxDecoration(color: PulzrColors.background, border: Border(top: BorderSide(color: PulzrColors.divider))),
      padding: const EdgeInsets.fromLTRB(10, 8, 10, 10),
      child: SafeArea(
        top: false,
        child: Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [
          for (var i = 0; i < items.length; i++)
            i == 2
                ? InkWell(customBorder: const CircleBorder(), onTap: () => onChanged(i), child: PulzrBoltMark(size: 54, filled: currentIndex == i))
                : InkResponse(
                    onTap: () => onChanged(i),
                    radius: 28,
                    child: SizedBox(
                      width: 56,
                      child: Column(mainAxisSize: MainAxisSize.min, children: [
                        Icon(items[i].$1, color: currentIndex == i ? PulzrColors.neon : PulzrColors.muted, size: 27),
                        const SizedBox(height: 4),
                        Text(items[i].$2, overflow: TextOverflow.ellipsis, style: TextStyle(color: currentIndex == i ? PulzrColors.neon : PulzrColors.muted, fontSize: 10, fontWeight: FontWeight.w800)),
                      ]),
                    ),
                  ),
        ]),
      ),
    );
  }
}

class FeedScreen extends StatelessWidget {
  const FeedScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const PulzrWordmark(), actions: [IconButton(icon: const Icon(Icons.notifications_none_rounded), onPressed: () {})]),
      body: ListView.builder(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 18),
        itemCount: feed.length,
        itemBuilder: (_, i) => ActivityCard(activity: feed[i]),
      ),
    );
  }
}

class ActivityCard extends StatelessWidget {
  const ActivityCard({super.key, required this.activity});
  final Activity activity;
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 18),
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(color: PulzrColors.card, borderRadius: BorderRadius.circular(16)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(children: [
            CircleAvatar(radius: 21, backgroundImage: NetworkImage(activity.athlete.avatarUrl), backgroundColor: PulzrColors.surface),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(activity.athlete.name, style: Theme.of(context).textTheme.titleMedium, overflow: TextOverflow.ellipsis),
              const SizedBox(height: 2),
              Text('${activity.athlete.location} - ${activity.time}', style: Theme.of(context).textTheme.bodySmall, overflow: TextOverflow.ellipsis),
            ])),
            IconButton(onPressed: () {}, icon: const Icon(Icons.more_horiz_rounded), color: PulzrColors.muted),
          ]),
        ),
        AspectRatio(
          aspectRatio: 1.08,
          child: Stack(fit: StackFit.expand, children: [
            Image.network(activity.imageUrl, fit: BoxFit.cover),
            const DecoratedBox(decoration: BoxDecoration(gradient: LinearGradient(begin: Alignment.bottomCenter, end: Alignment.topCenter, colors: [Colors.black87, Colors.transparent], stops: [0, .62]))),
            Positioned(left: 16, right: 16, bottom: 16, child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [for (final metric in activity.metrics) Flexible(child: MetricTile(label: metric.label, value: metric.value))])),
          ]),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(activity.title, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 6),
            Text(activity.caption, style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 14),
            const Divider(height: 1, color: PulzrColors.divider),
            const SizedBox(height: 12),
            RichText(text: TextSpan(children: [
              TextSpan(text: '${activity.commentAuthor} ', style: const TextStyle(color: PulzrColors.text, fontWeight: FontWeight.w800, fontSize: 13)),
              TextSpan(text: activity.comment, style: const TextStyle(color: PulzrColors.muted, fontSize: 13)),
            ])),
          ]),
        ),
      ]),
    );
  }
}

class MetricTile extends StatelessWidget {
  const MetricTile({super.key, required this.label, required this.value, this.large = false, this.align = CrossAxisAlignment.start});
  final String label, value;
  final bool large;
  final CrossAxisAlignment align;
  @override
  Widget build(BuildContext context) => Column(crossAxisAlignment: align, mainAxisSize: MainAxisSize.min, children: [
        Text(label, style: TextStyle(color: PulzrColors.muted, fontSize: large ? 12 : 10, fontWeight: FontWeight.w900)),
        const SizedBox(height: 3),
        FittedBox(fit: BoxFit.scaleDown, child: Text(value, maxLines: 1, style: TextStyle(color: PulzrColors.neon, fontSize: large ? 46 : 18, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic, height: 1))),
      ]);
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final medals = [(Icons.flash_on_rounded, 'Volt 10K', '10 km abaixo de 50m'), (Icons.shield_outlined, '6 dias', 'Sequencia ativa'), (Icons.workspace_premium_rounded, 'Top 3%', 'Ranking semanal'), (Icons.local_fire_department_rounded, 'HIIT', '12 sessoes')];
    final history = [('Corrida', 'Hoje', '10.5 km - 45:12', '+42 XP'), ('Academia', 'Ontem', 'Pernas + core - 68 min', '+31 XP'), ('Bike', 'Ter', '42 km - media 29.7 km/h', '+58 XP')];
    return Scaffold(
      appBar: AppBar(title: const PulzrWordmark(size: 20), actions: [IconButton(onPressed: () {}, icon: const Icon(Icons.settings_outlined))]),
      body: ListView(padding: const EdgeInsets.only(bottom: 24), children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
          child: Column(children: [
            Container(width: 106, height: 106, padding: const EdgeInsets.all(3), decoration: const BoxDecoration(color: PulzrColors.neon, shape: BoxShape.circle), child: const CircleAvatar(backgroundImage: NetworkImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop'))),
            const SizedBox(height: 14),
            Text(mainAthlete.name, style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 4),
            Text(mainAthlete.level, style: const TextStyle(color: PulzrColors.muted, fontWeight: FontWeight.w700)),
            const SizedBox(height: 18),
            Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: PulzrColors.card, borderRadius: BorderRadius.circular(16)), child: const Row(children: [
              Expanded(child: MetricTile(label: 'SEQUENCIA', value: '6D', align: CrossAxisAlignment.center)),
              SizedBox(height: 42, child: VerticalDivider(color: PulzrColors.divider)),
              Expanded(child: MetricTile(label: 'DISTANCIA', value: '184.2 KM', align: CrossAxisAlignment.center)),
              SizedBox(height: 42, child: VerticalDivider(color: PulzrColors.divider)),
              Expanded(child: MetricTile(label: 'RANKING', value: 'TOP 3%', align: CrossAxisAlignment.center)),
            ])),
          ]),
        ),
        const SectionTitle('Conquistas', trailing: '12 medalhas'),
        Padding(padding: const EdgeInsets.symmetric(horizontal: 20), child: GridView.builder(shrinkWrap: true, physics: const NeverScrollableScrollPhysics(), itemCount: medals.length, gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, mainAxisSpacing: 12, crossAxisSpacing: 12, childAspectRatio: 1.45), itemBuilder: (_, i) => AchievementCard(icon: medals[i].$1, title: medals[i].$2, subtitle: medals[i].$3))),
        const SectionTitle('Historico de treinos', trailing: 'Ver tudo'),
        Padding(padding: const EdgeInsets.symmetric(horizontal: 20), child: Column(children: [for (final item in history) WorkoutRow(type: item.$1, date: item.$2, summary: item.$3, xp: item.$4)])),
      ]),
    );
  }
}

class SectionTitle extends StatelessWidget {
  const SectionTitle(this.title, {super.key, this.trailing});
  final String title;
  final String? trailing;
  @override
  Widget build(BuildContext context) => Padding(padding: const EdgeInsets.fromLTRB(20, 24, 20, 12), child: Row(children: [Expanded(child: Text(title, style: Theme.of(context).textTheme.titleLarge)), if (trailing != null) Text(trailing!, style: const TextStyle(color: PulzrColors.neon, fontSize: 12, fontWeight: FontWeight.w900))]));
}

class AchievementCard extends StatelessWidget {
  const AchievementCard({super.key, required this.icon, required this.title, required this.subtitle});
  final IconData icon;
  final String title, subtitle;
  @override
  Widget build(BuildContext context) => Container(padding: const EdgeInsets.all(14), decoration: BoxDecoration(color: PulzrColors.card, borderRadius: BorderRadius.circular(16)), child: Row(children: [Container(width: 42, height: 42, decoration: BoxDecoration(color: PulzrColors.neon.withOpacity(.13), shape: BoxShape.circle), child: Icon(icon, color: PulzrColors.neon)), const SizedBox(width: 12), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center, children: [Text(title, maxLines: 1, overflow: TextOverflow.ellipsis, style: Theme.of(context).textTheme.titleMedium), const SizedBox(height: 3), Text(subtitle, maxLines: 2, overflow: TextOverflow.ellipsis, style: Theme.of(context).textTheme.bodySmall)]))]));
}

class WorkoutRow extends StatelessWidget {
  const WorkoutRow({super.key, required this.type, required this.date, required this.summary, required this.xp});
  final String type, date, summary, xp;
  @override
  Widget build(BuildContext context) => Container(margin: const EdgeInsets.only(bottom: 10), padding: const EdgeInsets.all(14), decoration: BoxDecoration(color: PulzrColors.card, borderRadius: BorderRadius.circular(16)), child: Row(children: [const CircleAvatar(backgroundColor: PulzrColors.surface, child: Icon(Icons.directions_run_rounded, color: PulzrColors.neon)), const SizedBox(width: 12), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(type, style: Theme.of(context).textTheme.titleMedium), Text('$date - $summary', overflow: TextOverflow.ellipsis, style: Theme.of(context).textTheme.bodySmall)])), Text(xp, style: const TextStyle(color: PulzrColors.neon, fontWeight: FontWeight.w900))]));
}

class LiveActivityScreen extends StatelessWidget {
  const LiveActivityScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const PulzrWordmark(size: 20), actions: [IconButton(onPressed: () {}, icon: const Icon(Icons.volume_up_outlined))]),
        body: SafeArea(top: false, child: Padding(padding: const EdgeInsets.fromLTRB(22, 20, 22, 24), child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Row(children: [const PulzrBoltMark(size: 46, filled: false), const SizedBox(width: 12), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Atividade em tempo real', style: Theme.of(context).textTheme.titleLarge), const Text('Corrida outdoor - GPS conectado', style: TextStyle(color: PulzrColors.muted, fontWeight: FontWeight.w700))])), const LivePill()]),
          const Spacer(),
          const Center(child: Text('00:45:12', style: TextStyle(color: PulzrColors.text, fontSize: 54, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic, height: 1))),
          const SizedBox(height: 28),
          const Center(child: MetricTile(label: 'DISTANCIA', value: '10.5 KM', large: true, align: CrossAxisAlignment.center)),
          const SizedBox(height: 30),
          Container(padding: const EdgeInsets.all(18), decoration: BoxDecoration(color: PulzrColors.card, borderRadius: BorderRadius.circular(16)), child: const Row(children: [Expanded(child: MetricTile(label: 'RITMO MEDIO', value: '5:09', align: CrossAxisAlignment.center)), SizedBox(height: 42, child: VerticalDivider(color: PulzrColors.divider)), Expanded(child: MetricTile(label: 'CALORIAS', value: '642', align: CrossAxisAlignment.center)), SizedBox(height: 42, child: VerticalDivider(color: PulzrColors.divider)), Expanded(child: MetricTile(label: 'BPM', value: '168', align: CrossAxisAlignment.center))])),
          const Spacer(),
          Row(children: [Expanded(child: ActionButton('FINALIZAR', filled: true)), const SizedBox(width: 12), Expanded(child: ActionButton('PAUSAR', filled: false))]),
        ]))),
      );
}

class ActionButton extends StatelessWidget {
  const ActionButton(this.label, {super.key, required this.filled});
  final String label;
  final bool filled;
  @override
  Widget build(BuildContext context) => SizedBox(height: 58, child: ElevatedButton(onPressed: () {}, style: ElevatedButton.styleFrom(elevation: 0, backgroundColor: filled ? PulzrColors.neon : PulzrColors.card, foregroundColor: filled ? Colors.black : PulzrColors.text, side: filled ? BorderSide.none : const BorderSide(color: PulzrColors.muted), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))), child: Text(label, style: TextStyle(color: filled ? Colors.black : PulzrColors.text, fontWeight: FontWeight.w900))));
}

class LivePill extends StatelessWidget {
  const LivePill({super.key});
  @override
  Widget build(BuildContext context) => Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6), decoration: BoxDecoration(color: PulzrColors.neon.withOpacity(.12), borderRadius: BorderRadius.circular(999), border: Border.all(color: PulzrColors.neon.withOpacity(.55))), child: const Text('LIVE', style: TextStyle(color: PulzrColors.neon, fontSize: 11, fontWeight: FontWeight.w900)));
}

class PlaceholderScreen extends StatelessWidget {
  const PlaceholderScreen(this.title, this.icon, {super.key});
  final String title;
  final IconData icon;
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: Text(title)), body: Center(child: Column(mainAxisSize: MainAxisSize.min, children: [Icon(icon, color: PulzrColors.neon, size: 44), const SizedBox(height: 16), Text(title, style: Theme.of(context).textTheme.headlineMedium)])));
}
