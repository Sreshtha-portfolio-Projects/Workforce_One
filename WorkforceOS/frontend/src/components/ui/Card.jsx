import { clsx } from 'clsx';

const Card = ({ children, className, padding = true, hover = false, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        padding && 'p-6',
        hover && 'transition-shadow hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }) => {
  return (
    <div className={clsx('mb-4', className)}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className }) => {
  return (
    <h3 className={clsx('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className }) => {
  return (
    <p className={clsx('text-sm text-gray-600 mt-1', className)}>
      {children}
    </p>
  );
};

const CardContent = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className }) => {
  return (
    <div className={clsx('mt-6 pt-4 border-t border-gray-200', className)}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
