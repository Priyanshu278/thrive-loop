import React from 'react';
import {
  BookOpen,
  X,
  MousePointer2,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Lightbulb,
  HelpCircle,
} from 'lucide-react';

/**
 * HelpGuideContent
 *
 * A beginner-friendly, user-facing guide for ThriveLoop. It is built as a
 * single reusable panel that renders one of four views:
 *
 *   - 'intro'        Welcome screen with the four simple questions
 *   - 'employee'     Employee first-time guide
 *   - 'hr'           HR first-time guide
 *   - 'quick'        "What do you want to do?" task guide
 *   - 'buttons'      Button / control dictionary
 *
 * All content is written for a normal user, in plain English. It does not
 * mention React, Express, APIs, JWT, or implementation details. Where a
 * feature is demo/simulated, it is labeled as such.
 */

const DEMO_LABEL = (
  <span style={{
    display: 'inline-block',
    fontSize: '10.5px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: '#92400E',
    background: '#FEF3C7',
    border: '1px solid #FDE68A',
    padding: '1px 7px',
    borderRadius: '9999px',
    marginLeft: '8px',
    verticalAlign: 'middle',
  }}>
    Demo / Simulated
  </span>
);

const stepCard = (number, eyebrow, title, blocks) => (
  <div style={{
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '14px',
    padding: '18px 20px',
    marginBottom: '14px',
    boxSizing: 'border-box',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
      <span style={{
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        background: '#ECFDF5',
        color: '#059669',
        display: 'grid',
        placeItems: 'center',
        fontWeight: 800,
        fontSize: '13px',
        flexShrink: 0,
      }}>
        {number}
      </span>
      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: '#64748B', textTransform: 'uppercase' }}>
        {eyebrow}
      </span>
    </div>
    <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
      {title}
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {blocks.map((b, i) => (
        <div key={i} style={{
          padding: '10px 12px',
          borderRadius: '10px',
          background: b.kind === 'click' ? '#EFF6FF' : b.kind === 'result' ? '#ECFDF5' : '#F8FAFC',
          border: b.kind === 'click' ? '1px solid #BFDBFE' : b.kind === 'result' ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
            {b.label === 'What you see:' && <MousePointer2 size={13} style={{ color: '#64748B', flexShrink: 0 }} />}
            {b.label === 'What to click:' && <CheckCircle2 size={13} style={{ color: '#10B981', flexShrink: 0 }} />}
            {b.label === 'What happens:' && <ArrowRight size={13} style={{ color: '#059669', flexShrink: 0 }} />}
            {b.label === 'What to do:' && <CheckCircle2 size={13} style={{ color: '#2563EB', flexShrink: 0 }} />}
            {b.label === 'If it fails:' && <HelpCircle size={13} style={{ color: '#DC2626', flexShrink: 0 }} />}
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {b.label}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#1E293B', margin: 0, lineHeight: 1.5 }}>
            {b.text}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const featureBlock = (name, blocks) => (
  <div style={{ marginBottom: '16px' }}>
    <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
      {name}
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {blocks.map((b, i) => (
        <div key={i} style={{
          padding: '9px 12px',
          borderRadius: '10px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {b.label}
            </span>
          </div>
          <p style={{ fontSize: '12.5px', color: '#1E293B', margin: 0, lineHeight: 1.45 }}>
            {b.text}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const quickItem = (task, path) => (
  <div style={{
    padding: '11px 14px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    marginBottom: '10px',
    boxSizing: 'border-box',
  }}>
    <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A', marginBottom: '3px' }}>
      {task}
    </div>
    <div style={{ fontSize: '12px', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
      <Lightbulb size={13} />
      <code>{path}</code>
    </div>
  </div>
);

const buttonRow = (name, does, where) => (
  <div style={{
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    marginBottom: '8px',
    boxSizing: 'border-box',
  }}>
    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
      {name}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      <div>
        <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
          What it does
        </div>
        <div style={{ fontSize: '12.5px', color: '#1E293B', lineHeight: 1.45 }}>
          {does}
        </div>
      </div>
      <div>
        <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
          Where it is
        </div>
        <div style={{ fontSize: '12.5px', color: '#1E293B', lineHeight: 1.45 }}>
          {where}
        </div>
      </div>
    </div>
  </div>
);

const hrSection = (title, blocks) => (
  <div style={{
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '14px',
    padding: '16px 18px',
    marginBottom: '14px',
    boxSizing: 'border-box',
  }}>
    <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
      {title}
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {blocks.map((b, i) => (
        <div key={i} style={{
          padding: '9px 12px',
          borderRadius: '10px',
          background: b.kind === 'click' ? '#EFF6FF' : b.kind === 'result' ? '#ECFDF5' : '#F8FAFC',
          border: b.kind === 'click' ? '1px solid #BFDBFE' : b.kind === 'result' ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            {b.label === 'What it is:' && <MousePointer2 size={13} style={{ color: '#64748B', flexShrink: 0 }} />}
            {b.label === 'What to click:' && <CheckCircle2 size={13} style={{ color: '#10B981', flexShrink: 0 }} />}
            {b.label === 'What happens:' && <ArrowRight size={13} style={{ color: '#059669', flexShrink: 0 }} />}
            {b.label === 'What to do next:' && <ArrowRight size={13} style={{ color: '#7C3AED', flexShrink: 0 }} />}
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {b.label}
            </span>
          </div>
          <p style={{ fontSize: '12.5px', color: '#1E293B', margin: 0, lineHeight: 1.45 }}>
            {b.text}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export function HelpGuideContent({ view, onClose, onViewEmployee, onViewHR, onViewQuick, onViewButtons, currentRole }) {
  const isHR = currentRole === 'hr';

  const renderIntro = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '18px 20px',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <BookOpen size={18} style={{ color: '#10B981', flexShrink: 0 }} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: '#64748B', textTransform: 'uppercase' }}>
            Welcome
          </span>
        </div>
        <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
          Welcome to ThriveLoop
        </h2>
        <p style={{ fontSize: '13.5px', color: '#334155', margin: 0, lineHeight: 1.55 }}>
          ThriveLoop helps you understand and improve your everyday workplace wellness.
        </p>
      </div>

      <div style={{
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '14px',
        padding: '14px 16px',
        boxSizing: 'border-box',
      }}>
        <p style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A', margin: '0 0 8px 0' }}>
          Every guide answers four simple questions:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            ['1. What is this?', 'What you are looking at.'],
            ['2. Where do I click?', 'The exact button or card to use.'],
            ['3. What happens when I click it?', 'The result you should expect.'],
            ['4. What should I do next?', 'The next useful action.'],
          ].map(([q, a]) => (
            <div key={q} style={{ padding: '8px 10px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#10B981' }}>{q}</div>
              <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>{a}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A', margin: 0 }}>
          Choose your guide:
        </p>
        {[
          ['Employee Guide', 'For people using ThriveLoop for their own daily wellness.', !isHR],
          ['HR Admin Guide', 'For HR admins using the team and program views.', isHR],
        ].map(([title, desc, recommended]) => (
          <button
            key={title}
            type="button"
            onClick={isHR && title.startsWith('HR') ? onViewHR : (title.startsWith('Employee') ? onViewEmployee : () => {})}
            style={{
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              background: recommended ? '#ECFDF5' : '#FFFFFF',
              color: '#0F172A',
              cursor: 'pointer',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>{title}</div>
              <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '1px' }}>{desc}</div>
            </div>
            {recommended && (
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', color: '#059669', border: '1px solid #A7F3D0', borderRadius: '9999px', padding: '2px 8px', background: '#FFFFFF' }}>
                Recommended
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderEmployee = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {/* STEP 1 — LOGIN */}
      {stepCard(1, 'Step 1 · Sign in', 'Login', [
        { kind: 'see', label: 'What you see:', text: 'A sign-in screen with two demo quick-access buttons: Alex (Employee) and HR Admin Portal.' },
        { kind: 'do', label: 'What to do:', text: 'Choose one of the demo quick-access buttons, or type your work email and password and click Sign in.' },
        { kind: 'click', label: 'What to click:', text: 'Alex (Employee) for the employee view, HR Admin Portal for the HR view, or Sign in.' },
        { kind: 'result', label: 'What happens:', text: 'ThriveLoop signs you in and opens your dashboard. If you clicked Alex, you land on the Employee Home. If you clicked HR Admin Portal, you land on the HR Overview.' },
        { kind: 'fail', label: 'If login fails:', text: 'An error message appears on the sign-in screen. Correct the email or password and try again. Do not invent a token — ThriveLoop shows the real error.' },
      ])}

      {/* STEP 2 — HOME */}
      {stepCard(2, 'Step 2 · First screen', 'Home', [
        { kind: 'see', label: 'What you see:', text: 'A greeting banner, your daily step, active minutes, and sleep summary, a weekly activity chart, quick habit checklist, upcoming challenges, and your team card.' },
        { kind: 'click', label: 'What to click first:', text: 'Start Today to open the daily check-in, or click any metric card for more detail.' },
        { kind: 'result', label: 'What happens:', text: 'ThriveLoop opens the feature you clicked, or a modal with more detail.' },
        { kind: 'do', label: 'What to do next:', text: 'Look at your three main metric cards first: Steps, Active Minutes, and Sleep.' },
      ])}

      {/* EMPLOYEE HOME FEATURES */}
      <div style={{ marginTop: '6px', padding: '14px 16px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', boxSizing: 'border-box' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Main Home features</h3>
        <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 10px 0' }}>
          Each card below is a real part of the Employee Home screen.
        </p>

        {featureBlock('Steps', [
          { label: 'What is it?', text: 'Your daily step activity.' },
          { label: 'Why use it?', text: 'To see how much you moved today and how close you are to your step goal.' },
          { label: 'Where is it?', text: 'Home, in the hero metric row and the rings chart.' },
          { label: 'What to click?', text: 'The Steps metric card or the blue Daily Steps row in the rings chart.' },
          { label: 'What happens after clicking?', text: 'Steps Analytics opens in a modal so you can review your activity.' },
          { label: 'What next?', text: 'Review your steps, then close the modal and continue on Home.' },
        ])}

        {featureBlock('Active Minutes', [
          { label: 'What is it?', text: 'Your daily active time.' },
          { label: 'Why use it?', text: 'To see how active you were and how close you are to your active minutes goal.' },
          { label: 'Where is it?', text: 'Home, in the hero metric row and the rings chart.' },
          { label: 'What to click?', text: 'The Active Minutes metric card or the orange Active Minutes row in the rings chart.' },
          { label: 'What happens after clicking?', text: 'Active Minutes Analytics opens in a modal.' },
          { label: 'What next?', text: 'Check your minutes, then go back to Home.' },
        ])}

        {featureBlock('Sleep', [
          { label: 'What is it?', text: 'Your sleep activity for the day.' },
          { label: 'Why use it?', text: 'To see how much you slept and how close you are to your sleep goal.' },
          { label: 'Where is it?', text: 'Home, in the hero metric row and the rings chart.' },
          { label: 'What to click?', text: 'The Sleep metric card or the purple Restful Sleep row in the rings chart.' },
          { label: 'What happens after clicking?', text: 'Sleep Analytics opens in a modal. The Sleep page can show a Last Night tab if available.' },
          { label: 'What next?', text: 'Review your sleep, then close the modal.' },
        ])}

        {featureBlock('Today\'s Check-in', [
          { label: 'What is it?', text: 'A quick daily check-in you can submit from Home.' },
          { label: 'Where is it?', text: 'Home, in the Start Today button.' },
          { label: 'What to click?', text: 'Start Today.' },
          { label: 'What happens after clicking?', text: 'A Check-in modal opens so you can record your daily activity.' },
          { label: 'What next?', text: 'Fill in the check-in and save it.' },
        ])}

        {featureBlock('Sync Smartwatch', [
          { label: 'What is it?', text: 'A smartwatch sync screen.' },
          { label: 'Note', text: 'This is a demo/simulated experience in the current web app.' },
          { label: 'Where is it?', text: 'Home, in the Sync Smartwatch button in the hero banner.' },
          { label: 'What to click?', text: 'Sync Smartwatch.' },
          { label: 'What happens after clicking?', text: 'A sync overlay opens showing smartwatch-style devices.' },
          { label: 'What next?', text: 'Close the overlay when you are done.' },
        ])}

        {featureBlock('Habit Checklist', [
          { label: 'What is it?', text: 'A short list of today\'s priority habits.' },
          { label: 'Where is it?', text: 'Home, in the Today\'s Focus card.' },
          { label: 'What to click?', text: 'Click a habit row to mark it complete or uncompleted.' },
          { label: 'What happens after clicking?', text: 'The habit updates its checked state and the completion count changes.' },
          { label: 'What next?', text: 'Work through the habits you want to finish today.' },
        ])}

        {featureBlock('Goals', [
          { label: 'What is it?', text: 'Your personal goal progress.' },
          { label: 'Where is it?', text: 'Profile, in the Goals tab and the progress card.' },
          { label: 'What to click?', text: 'The Goals-related controls in your Profile.' },
          { label: 'What happens after clicking?', text: 'ThriveLoop opens your goals view.' },
          { label: 'What next?', text: 'Check your progress and choose a goal to focus on.' },
        ])}

        {featureBlock('Quick Actions', [
          { label: 'What is it?', text: 'Shortcuts that open the most-used features from Home.' },
          { label: 'Where is it?', text: 'Home, in the hero banner and metric cards.' },
          { label: 'What to click?', text: 'Start Today, Sync Smartwatch, View Today\'s Plan, or a metric card.' },
          { label: 'What happens after clicking?', text: 'ThriveLoop opens the related feature or modal.' },
          { label: 'What next?', text: 'Use the shortcut that matches what you want to do now.' },
        ])}
      </div>

      {/* CHALLENGES */}
      {stepCard(3, 'Step 3 · Team activity', 'Challenges', [
        { kind: 'see', label: 'What you see:', text: 'The active weekly team challenge with a progress bar, team activity chart, tips, rewards, and challenge rules.' },
        { kind: 'click', label: 'What to click:', text: 'Start Challenge to join the challenge, Challenge Active to log more steps, Adapt with AI to generate a new challenge, or Cheer Team to send encouragement.' },
        { kind: 'result', label: 'What happens:', text: 'Start Challenge joins you to the challenge and adds progress. Challenge Active logs steps toward the squad challenge. Adapt with AI attempts to generate a new challenge. Cheer Team sends encouragement to the team.' },
        { kind: 'do', label: 'What to do next:', text: 'Check the team progress bar and choose an action that matches your day.' },
      ])}

      {/* ADAPT WITH AI */}
      {featureBlock('Adapt with AI', [
        { label: 'What is it?', text: 'A challenge generation control on the Challenge page.' },
        { label: 'Note', text: 'This is a demo/simulated feature in the current app.' },
        { label: 'Where is it?', text: 'Challenge page, near the challenge actions.' },
        { label: 'What to click?', text: 'Adapt with AI.' },
        { label: 'What happens after clicking?', text: 'ThriveLoop tries to generate a new adaptive challenge and shows a confirmation message.' },
        { label: 'What next?', text: 'Review the result message and continue with your challenge.' },
      ])}

      {/* RESCUE */}
      {stepCard(4, 'Step 4 · Reset when needed', 'Rescue', [
        { kind: 'see', label: 'What you see:', text: 'A rescue page that explains Rescue Mode and shows your current rescue goal, progress, tips, and timeline.' },
        { kind: 'click', label: 'What to click:', text: 'Rescue Mode Active, Continue Rescue Mode, Mark as Completed, Snooze 15m, Accept 3-Min Micro-Walk, or How Rescue Works.' },
        { kind: 'result', label: 'What happens:', text: 'Rescue Mode Active confirms rescue is protecting your streak. Continue Rescue Mode keeps rescue going. Mark as Completed marks the rescue as done. Snooze 15m snoozes the rescue nudge. Accept 3-Min Micro-Walk accepts a short rescue walk. How Rescue Works opens an explanation modal.' },
        { kind: 'do', label: 'What to do next:', text: 'Use Rescue when your normal goal feels too hard. Finish the rescue goal or mark the rescue as completed when you are ready.' },
      ])}

      {/* MICRO-WALK */}
      {featureBlock('Micro-Walk', [
        { label: 'What is it?', text: 'A short rescue activity you can accept from the Rescue page.' },
        { label: 'Note', text: 'This is a demo/simulated nudge style interaction in the current app.' },
        { label: 'Where is it?', text: 'Rescue page, in the rescue nudge area.' },
        { label: 'What to click?', text: 'Accept 3-Min Micro-Walk.' },
        { label: 'What happens after clicking?', text: 'ThriveLoop confirms the micro-walk was accepted.' },
        { label: 'What next?', text: 'Return to the dashboard when you are done.' },
      ])}

      {/* TEAM */}
      {stepCard(5, 'Step 5 · Your people', 'Team', [
        { kind: 'see', label: 'What you see:', text: 'Your team name, team progress, team activity trend, squad roster, recent team activity, team insights, and the squad challenge.' },
        { kind: 'click', label: 'What to click:', text: 'Click the invite code chip to copy it. Click a team card or View Details to see more.' },
        { kind: 'result', label: 'What happens:', text: 'Clicking the invite code copies the invite code to your clipboard and shows a short confirmation. Clicking a team card opens the team detail view.' },
        { kind: 'do', label: 'What to do next:', text: 'Share the invite code with teammates if needed, then review your squad activity.' },
      ])}

      {/* PROFILE */}
      {stepCard(6, 'Step 6 · Your account', 'Profile', [
        { kind: 'see', label: 'What you see:', text: 'Your name, email-style info, department, location, member info, wellness streak, four metric cards, profile tabs, recent activity, achievements, and upcoming goals.' },
        { kind: 'click', label: 'What to click:', text: 'Edit Profile, Sign out, a metric card, a tab, See All, or View All.' },
        { kind: 'result', label: 'What happens:', text: 'Edit Profile opens an edit overlay where you can change your photo, name, department, and location. Sign out ends your session. Metric cards open analytics. Tabs switch profile views. See All and View All open logs or achievement lists.' },
        { kind: 'do', label: 'What to do next:', text: 'Edit your profile if needed, then Save Changes or Cancel. Save changes and Close the overlay. Sign out if you are finished.' },
      ])}

      {/* LOGOUT */}
      {featureBlock('Sign Out', [
        { label: 'What is it?', text: 'The control that ends your current session.' },
        { label: 'Where is it?', text: 'Profile page, in the sign-out button area, or in the profile menu.' },
        { label: 'What to click?', text: 'Sign Out.' },
        { label: 'What happens after clicking?', text: 'ThriveLoop signs you out and returns you to the sign-in screen.' },
        { label: 'What next?', text: 'If you are done, you can close the browser or sign in again later.' },
      ])}
    </div>
  );

  const renderHR = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {stepCard(1, 'Step 1 · Sign in', 'HR Login', [
        { kind: 'see', label: 'What you see:', text: 'The sign-in screen with the HR Admin Portal quick-access button.' },
        { kind: 'click', label: 'What to click:', text: 'HR Admin Portal, or type your HR email, password, and optional HR access code, then click Sign in.' },
        { kind: 'result', label: 'What happens:', text: 'If you are authenticated for HR, ThriveLoop opens the HR Overview. If HR credentials are not present, the app may show a preview-mode notice and display illustrative data.' },
        { kind: 'do', label: 'What to do next:', text: 'From the Overview, use the HR sidebar to move between sections.' },
      ])}

      {stepCard(2, 'Step 2 · First screen', 'HR Overview', [
        { kind: 'see', label: 'What you see:', text: 'Five KPI cards, engagement and wellness trend charts, team participation, key insights, department participation rhythms, program impact snapshot, recent activity, and an Export Boardroom PDF button.' },
        { kind: 'click', label: 'What to click:', text: 'Any KPI card area, a View All link, a View Report link, or the Export Boardroom PDF button.' },
        { kind: 'result', label: 'What happens:', text: 'View All and View Report links move you to related HR sections. The Export Boardroom PDF button opens your browser print / save dialog.' },
        { kind: 'do', label: 'What to do next:', text: 'Review the five KPIs first, then open Teams, Impact, Privacy, or ROI from the sidebar.' },
      ])}

      {hrSection('Teams', [
        { kind: 'see', label: 'What it is:', text: 'A directory of team cohorts with member counts, participation, steps, sleep, sparklines, and status badges.' },
        { kind: 'click', label: 'What to click:', text: 'Category pills, the search box, a team card, or View Details.' },
        { kind: 'result', label: 'What happens:', text: 'Category pills and search filter the directory. Clicking a team card or View Details opens the team detail view.' },
        { kind: 'do', label: 'What to do next:', text: 'Find the team you want, then open its details to review its activity.' },
      ])}

      {hrSection('Impact', [
        { kind: 'see', label: 'What it is:', text: 'A before-and-after program impact view with a baseline/post-pilot switcher and key impact numbers.' },
        { kind: 'click', label: 'What to click:', text: 'The Baseline and Post-Pilot switcher buttons.' },
        { kind: 'result', label: 'What happens:', text: 'ThriveLoop switches between the baseline and post-pilot numbers so you can compare them.' },
        { kind: 'do', label: 'What to do next:', text: 'Compare the two views and review the impact KPIs.' },
      ])}

      {hrSection('Privacy', [
        { kind: 'see', label: 'What it is:', text: 'A privacy and governance view that explains how ThriveLoop protects individual data.' },
        { kind: 'do', label: 'What to understand:', text: 'ThriveLoop is designed so that individual records are not exposed in team or HR views unless the privacy threshold is met.' },
        { kind: 'do', label: 'What to do next:', text: 'Read the privacy controls and confirm the privacy approach matches your needs.' },
      ])}

      {hrSection('ROI', [
        { kind: 'see', label: 'What it is:', text: 'An ROI modeler where you enter employee count, price per employee, and cost per resignation, then review the result.' },
        { kind: 'click', label: 'What to click:', text: 'The input values, the scenario presets, and the currency toggle.' },
        { kind: 'result', label: 'What happens:', text: 'ThriveLoop recomputes the investment, break-even, savings, and net benefit as you change the inputs. The currency toggle switches between USD and INR.' },
        { kind: 'do', label: 'What to do next:', text: 'Adjust the values to match your company, then review the result.' },
      ])}

      {hrSection('PDF Export', [
        { kind: 'see', label: 'Where it is:', text: 'On the HR pages, in the top export button area. It is labeled Export Boardroom PDF.' },
        { kind: 'click', label: 'What to click:', text: 'Export Boardroom PDF.' },
        { kind: 'result', label: 'What happens:', text: 'ThriveLoop opens your browser print dialog. The button itself calls your browser\'s print action. What you see next — a print preview, a save dialog, or a Microsoft Print to PDF option — depends on your browser and operating system, not on ThriveLoop.' },
        { kind: 'do', label: 'What to do next:', text: 'Use your browser/OS dialog to print or save the report as a PDF. If you do not see a preview, that is usually an OS or browser display step rather than a ThriveLoop error.' },
      ])}

      {stepCard(3, 'Step 3 · Finish', 'Logout', [
        { kind: 'see', label: 'Where it is:', text: 'In the profile menu or on the Profile page.' },
        { kind: 'click', label: 'What to click:', text: 'Sign Out.' },
        { kind: 'result', label: 'What happens:', text: 'ThriveLoop ends your session and returns you to the sign-in screen.' },
        { kind: 'do', label: 'What to do next:', text: 'If you need to return later, sign in again.' },
      ])}
    </div>
  );

  const renderQuick = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ padding: '14px 16px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', boxSizing: 'border-box' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
          What do you want to do?
        </h3>
        <p style={{ fontSize: '12px', color: '#64748B', margin: 0, marginBottom: '12px' }}>
          Pick a task. The guide shows the path.
        </p>

        {quickItem('Check my sleep', 'Home → Sleep')}
        {quickItem('Check my steps', 'Home → Steps')}
        {quickItem('Check my active minutes', 'Home → Active Minutes')}
        {quickItem('Join a challenge', 'Challenge → choose an action')}
        {quickItem('Start a quick wellness activity', 'Rescue → choose an activity')}
        {quickItem('See my team', 'Team')}
        {quickItem('Edit my profile', 'Profile → Edit Profile → Save Changes')}
        {quickItem('Log out', 'Profile → Sign Out')}
        {quickItem('HR: view team information', 'HR → Teams')}
        {quickItem('HR: view wellness impact', 'HR → Impact')}
        {quickItem('HR: view ROI information', 'HR → ROI')}
        {quickItem('HR: export a report', 'HR → Export Boardroom PDF')}
      </div>

      <div style={{ fontSize: '11.5px', color: '#64748B', padding: '0 4px' }}>
        Paths above are examples based on the current ThriveLoop experience. Button names may change slightly by screen size.
      </div>
    </div>
  );

  const renderButtons = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ padding: '14px 16px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', boxSizing: 'border-box' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
          Button and control dictionary
        </h3>
        <p style={{ fontSize: '12px', color: '#64748B', margin: 0, marginBottom: '12px' }}>
          The controls below exist in the current ThriveLoop experience.
        </p>

        {buttonRow('Sign in', 'Signs you into ThriveLoop.', 'Sign-in screen')}
        {buttonRow('Alex (Employee)', 'Starts an employee demo sign-in.', 'Sign-in screen')}
        {buttonRow('HR Admin Portal', 'Starts an HR demo sign-in.', 'Sign-in screen')}
        {buttonRow('Sign Out', 'Ends your current session.', 'Profile page or profile menu')}
        {buttonRow('Start Today', 'Opens the daily check-in.', 'Home hero banner')}
        {buttonRow('Sync Smartwatch', 'Opens the smartwatch sync screen.', 'Home hero banner')}
        {buttonRow('Steps / Active Minutes / Sleep cards', 'Opens the matching analytics view.', 'Home hero metric row and rings chart')}
        {buttonRow('Start Challenge', 'Joins the active challenge.', 'Challenge page')}
        {buttonRow('Challenge Active', 'Logs steps to the squad challenge.', 'Challenge page')}
        {buttonRow('Adapt with AI', 'Tries to generate a new challenge.', 'Challenge page (demo/simulated)')}
        {buttonRow('Cheer Team', 'Sends encouragement to the team.', 'Challenge page')}
        {buttonRow('Accept 3-Min Micro-Walk', 'Accepts a short rescue walk.', 'Rescue page')}
        {buttonRow('Snooze 15m', 'Snoozes the rescue nudge.', 'Rescue page')}
        {buttonRow('How Rescue Works', 'Opens the rescue explanation modal.', 'Rescue page')}
        {buttonRow('Continue Rescue Mode / Mark as Completed', 'Continues or finishes a rescue.', 'Rescue page')}
        {buttonRow('Invite code chip', 'Copies the team invite code.', 'Team page')}
        {buttonRow('View Details', 'Opens a team detail view.', 'Team page or HR Teams')}
        {buttonRow('Edit Profile', 'Opens the profile edit overlay.', 'Profile page')}
        {buttonRow('Save Changes / Cancel', 'Saves or discards profile edits.', 'Edit Profile overlay')}
        {buttonRow('View All / See All', 'Opens more detail for the current section.', 'Several pages, depending on context')}
        {buttonRow('Export Boardroom PDF', 'Opens the browser print/save dialog for an HR report.', 'HR pages')}
        {buttonRow('Baseline / Post-Pilot', 'Switches the Impact view.', 'HR Impact page')}
        {buttonRow('Currency toggle', 'Switches ROI between USD and INR.', 'HR ROI page')}
      </div>

      <div style={{ fontSize: '11.5px', color: '#64748B', padding: '0 4px' }}>
        This dictionary is a quick reference. It lists controls that exist in the current app. If a control looks decorative, this guide does not describe it as an action.
      </div>
    </div>
  );

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '16px',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      {/* Header strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px',
        borderBottom: '1px solid #E2E8F0',
        background: '#F8FAFC',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={16} style={{ color: '#10B981' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            How to use ThriveLoop
          </span>
        </div>
        <button type="button" onClick={onClose} aria-label="Close guide" style={{ color: '#64748B', padding: '4px', borderRadius: '6px' }}>
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px 18px', maxHeight: '68vh', overflowY: 'auto' }}>
        {view === 'intro' && renderIntro()}
        {view === 'employee' && renderEmployee()}
        {view === 'hr' && renderHR()}
        {view === 'quick' && renderQuick()}
        {view === 'buttons' && renderButtons()}
      </div>

      {/* Footer nav */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 18px',
        borderTop: '1px solid #E2E8F0',
        background: '#F8FAFC',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button type="button" onClick={onViewEmployee} style={navBtnStyle('Employee Guide')}>
            Employee Guide
          </button>
          <button type="button" onClick={onViewHR} style={navBtnStyle('HR Guide')}>
            HR Guide
          </button>
          <button type="button" onClick={onViewQuick} style={navBtnStyle('Quick Guide')}>
            Quick Guide
          </button>
          <button type="button" onClick={onViewButtons} style={navBtnStyle('Button Dictionary')}>
            Button Dictionary
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10.5px', color: '#64748B' }}>Use this guide to learn the product.</span>
          <button type="button" onClick={onClose} aria-label="Close guide" style={{ color: '#059669', padding: '4px 10px', borderRadius: '8px', border: '1px solid #A7F3D0', background: '#ECFDF5', fontSize: '12px', fontWeight: 700 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function navBtnStyle(label) {
  return {
    fontSize: '12px',
    fontWeight: 600,
    color: '#0F172A',
    background: 'transparent',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '5px 10px',
    cursor: 'pointer',
  };
}
