import { ClaudeService } from '../claude';

export interface SVGDesign {
  pageName: string;
  svgContent: string;
}

export interface ConversionResult {
  componentCode: string;
  pagePath: string;
  success: boolean;
  error?: string;
}

export class SVGConverter {
  private claude: ClaudeService;

  constructor(apiKey: string) {
    this.claude = new ClaudeService(apiKey);
  }

  async convertToComponent(design: SVGDesign): Promise<ConversionResult> {
    try {
      const response = await this.claude.generateComponent(design.svgContent);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return {
        componentCode: response.content,
        pagePath: `src/app/${design.pageName}/page.tsx`,
        success: true
      };
    } catch (error) {
      return {
        componentCode: '',
        pagePath: '',
        success: false,
        error: error instanceof Error ? error.message : 'Failed to convert SVG'
      };
    }
  }
}
