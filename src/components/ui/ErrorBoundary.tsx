import { Component, type ReactNode } from "react";
import { Screen } from "./Screen";
import { Text } from "./Text";
import { AppButton } from "./AppButton";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }

  handleReset = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Screen className="items-center justify-center gap-4 px-6">
          <Text variant="subtitle" className="text-center">
            Une erreur inattendue est survenue
          </Text>
          <Text variant="caption" className="text-center">
            {this.state.message}
          </Text>
          <AppButton label="Réessayer" onPress={this.handleReset} />
        </Screen>
      );
    }

    return this.props.children;
  }
}
