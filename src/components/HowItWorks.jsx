import { MapPin, Search, CheckCircle } from 'lucide-react';
import './HowItWorks.css';

const steps = [
  {
    id: 1,
    title: 'Detect Location',
    description: 'Allow access to your device GPS to instantly pinpoint your exact location on the map.',
    icon: MapPin,
    color: 'var(--primary)'
  },
  {
    id: 2,
    title: 'Choose Service',
    description: 'Select from essential categories like hospital, repair, pharmacy, or describe your problem.',
    icon: Search,
    color: 'var(--cat-repair)'
  },
  {
    id: 3,
    title: 'Get Help Fast',
    description: 'View the nearest verified service providers, check their distance, and get immediate directions.',
    icon: CheckCircle,
    color: 'var(--cat-food)'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        
        <div className="section-header">
          <h2>How CivicConnect Works</h2>
          <p>Get the help you need in three simple steps</p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="step-card glass-card">
                <div className="step-number">{step.id}</div>
                <div className="step-icon-wrapper" style={{ color: step.color, backgroundColor: `${step.color}15` }}>
                  <Icon size={32} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="step-connector"></div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
