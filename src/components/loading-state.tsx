import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Spinner } from './ui/kibo-ui/spinner';

interface LoadingStateProps {
  title: string;
  description: string;
}

export const LoadingState = ({ title, description }: LoadingStateProps) => {
  return (
    <Card className="max-w-sm">
      <div className="flex items-center justify-center">
        <Spinner variant="ellipsis" />
      </div>

      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};
