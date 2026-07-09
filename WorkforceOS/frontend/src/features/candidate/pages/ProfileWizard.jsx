import PlaceholderPage from '../../../components/common/PlaceholderPage';

const ProfileWizard = () => {
  return (
    <PlaceholderPage
      title="Profile Completion Wizard"
      description="Complete your profile in 5 easy steps"
      implementationNotes={[
        'Step 1: Upload Resume with drag & drop',
        'Step 2: Personal Information (name, DOB, contact, address)',
        'Step 3: Education Information (degrees + skills tags)',
        'Step 4: Additional Information (bank, employment history, compensation)',
        'Step 5: Review & Submit all sections',
        'Use the Stepper component already created',
        'Follow exact design mockups provided by the user',
        'Save draft functionality on each step',
        'Calculate profile completion percentage'
      ]}
    />
  );
};

export default ProfileWizard;
