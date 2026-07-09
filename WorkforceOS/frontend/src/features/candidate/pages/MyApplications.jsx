import PlaceholderPage from '../../../components/common/PlaceholderPage';

const MyApplications = () => {
  return <PlaceholderPage title="My Applications" description="Track all your job applications" implementationNotes={[
    'Tabs for different statuses (Active, Under Review, Interview, Offer, etc.)',
    'Application cards with job title, company, status, applied date',
    'Timeline showing application progress',
    'Follow the application page design mockup',
    'Use candidateService.getApplications()'
  ]} />;
};

export default MyApplications;
