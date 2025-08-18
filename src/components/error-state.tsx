import { CircleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ErrorStateProps {
    title:string;
    description:string
}

export const ErrorState = ({title,description}:ErrorStateProps) => {
    return (
        <Card className="max-w-sm">
            <div className="flex items-center justify-center">
                <CircleAlert className="size-12" />

            </div>

            <CardHeader className="text-center">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
        <CardContent className="text-center">
            <p className="text-muted-foreground">{description}</p>

        </CardContent>
        </Card>
    )
}
