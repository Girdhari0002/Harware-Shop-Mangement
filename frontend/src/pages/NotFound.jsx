import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="text-center max-w-md">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">404 - Page Not Found</h2>
        <p className="text-text-secondary mb-6">The page may have moved or the link may be incorrect.</p>
        <Button variant="primary" asChild>
          <Link to="/dashboard">← Back to Dashboard</Link>
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;