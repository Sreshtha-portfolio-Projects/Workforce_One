import PlaceholderPage from '../../../components/common/PlaceholderPage';

const BrowseJobs = () => {
  return (
    <PlaceholderPage
      title="Browse Jobs"
      description="Explore available job opportunities"
      implementationNotes={[
        'Job cards with title, department, location, employment type',
        'Filters: department, location, employment type, experience',
        'Search functionality',
        'Sort options (newest, salary, relevance)',
        'Pagination',
        'Quick apply button on each card',
        'Use candidateService.getJobs() to fetch data'
      ]}
    />
  );
};

export default BrowseJobs;
