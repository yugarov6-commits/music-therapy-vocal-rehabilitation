export default function AboutSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20" style={{ background: 'hsl(240, 22%, 5%)' }}>
      <div className="w-full max-w-3xl">

        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase mb-3 font-body" style={{ color: 'hsl(45, 70%, 65%)' }}>
            О методе
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-light mb-4" style={{ color: 'hsl(45, 30%, 90%)' }}>
            Музыкотерапия
          </h2>
          <p className="font-body text-base" style={{ color: 'hsl(240, 10%, 55%)' }}>
            Научно обоснованный метод работы со звуком, голосом и эмоциями
          </p>
        </div>

        {/* Что это такое */}
        <div className="rounded-3xl border p-8 mb-6" style={{ background: 'hsl(240, 18%, 9%)', borderColor: 'hsl(240, 15%, 18%)' }}>
          <p className="text-xs tracking-widest uppercase mb-4 font-body" style={{ color: 'hsl(175, 55%, 45%)' }}>Что это такое</p>
          <p className="font-body text-sm leading-relaxed mb-4" style={{ color: 'hsl(240, 10%, 65%)' }}>
            Музыкотерапия — это клинически признанный метод, при котором музыка и звук используются как инструмент лечения и реабилитации. Она применяется в неврологии, онкологии, психиатрии и восстановительной медицине по всему миру.
          </p>
          <p className="font-body text-sm leading-relaxed" style={{ color: 'hsl(240, 10%, 65%)' }}>
            Звуковые волны воздействуют на нервную систему напрямую — минуя сознательный контроль. Именно поэтому музыка способна менять частоту сердцебиения, снижать уровень кортизола и запускать выброс дофамина.
          </p>
        </div>

        {/* Как это работает */}
        <div className="rounded-3xl border p-8 mb-6" style={{ background: 'hsl(240, 18%, 9%)', borderColor: 'hsl(240, 15%, 18%)' }}>
          <p className="text-xs tracking-widest uppercase mb-6 font-body" style={{ color: 'hsl(270, 50%, 65%)' }}>Как это работает</p>
          <div className="flex flex-col gap-5">
            {[
              {
                num: '01',
                title: 'Частота и резонанс',
                desc: 'Каждый звук — это вибрация. Музыка на 432 Гц воспринимается как более тёплая и расслабляющая, а 440 Гц — как более бодрящая и концертная. Тело буквально резонирует в такт.',
                color: 'hsl(175, 55%, 45%)',
              },
              {
                num: '02',
                title: 'Эмоциональная коррекция',
                desc: 'Подбор музыки под текущее настроение — не развлечение, а терапевтический приём. ISO-принцип: начинаем с музыки, соответствующей состоянию, и постепенно ведём к желаемому.',
                color: 'hsl(45, 70%, 65%)',
              },
              {
                num: '03',
                title: 'Вокал и голосовые складки',
                desc: 'Пение и гудение активируют блуждающий нерв — главный канал парасимпатической нервной системы. Даже тихое мычание снижает тревогу и расслабляет мышцы гортани.',
                color: 'hsl(270, 50%, 65%)',
              },
              {
                num: '04',
                title: 'Дыхание как основа',
                desc: 'Диафрагмальное дыхание — физиологический якорь спокойствия. Долгий выдох активирует парасимпатику, снижает давление и готовит голос к работе без форсирования.',
                color: 'hsl(245, 55%, 65%)',
              },
            ].map((item) => (
              <div key={item.num} className="flex gap-5 items-start">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-display text-xs font-medium"
                  style={{ background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}30` }}
                >
                  {item.num}
                </div>
                <div>
                  <p className="font-body font-medium text-sm mb-1" style={{ color: 'hsl(45, 20%, 85%)' }}>{item.title}</p>
                  <p className="font-body text-sm leading-relaxed" style={{ color: 'hsl(240, 10%, 55%)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Где применяется */}
        <div className="rounded-3xl border p-8 mb-6" style={{ background: 'hsl(240, 18%, 9%)', borderColor: 'hsl(240, 15%, 18%)' }}>
          <p className="text-xs tracking-widest uppercase mb-5 font-body" style={{ color: 'hsl(35, 80%, 60%)' }}>Где применяется</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Реабилитация после инсульта', emoji: '🧠' },
              { label: 'Восстановление голоса', emoji: '🎙' },
              { label: 'Снижение тревожности', emoji: '🌀' },
              { label: 'Онкологическая поддержка', emoji: '🌿' },
              { label: 'Работа с болью', emoji: '💊' },
              { label: 'Детская нейрореабилитация', emoji: '🎠' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 p-4 rounded-2xl"
                style={{ background: 'hsl(240, 20%, 7%)', border: '1px solid hsl(240, 15%, 14%)' }}
              >
                <span style={{ fontSize: '20px' }}>{item.emoji}</span>
                <p className="font-body text-xs leading-snug" style={{ color: 'hsl(240, 10%, 60%)' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Важно знать */}
        <div
          className="rounded-3xl p-6 flex items-start gap-4"
          style={{ background: 'hsl(45, 60%, 10%)', border: '1px solid hsl(45, 60%, 25%, 0.5)' }}
        >
          <span style={{ fontSize: '22px', flexShrink: 0 }}>⚠️</span>
          <p className="font-body text-sm leading-relaxed" style={{ color: 'hsl(45, 30%, 70%)' }}>
            Музыкотерапия — дополнение к лечению, а не замена. При серьёзных заболеваниях голоса, нервной системы или психики всегда консультируйтесь с врачом или сертифицированным музыкотерапевтом.
          </p>
        </div>

      </div>
    </section>
  );
}
