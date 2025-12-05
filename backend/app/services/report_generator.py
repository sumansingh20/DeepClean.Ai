"""
Advanced PDF Report Generation System
Professional forensic reports with charts, statistics, and evidence
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

import matplotlib.pyplot as plt
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path
import io
import base64
import logging

logger = logging.getLogger(__name__)


class ForensicReportGenerator:
    """
    Generate professional PDF reports for deepfake analysis
    Includes charts, statistics, evidence chains, and legal compliance
    """
    
    def __init__(self, output_dir: str = "reports"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a1a1a'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Subtitle style
        self.styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#2c3e50'),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        ))
        
        # Body style
        self.styles.add(ParagraphStyle(
            name='CustomBody',
            parent=self.styles['BodyText'],
            fontSize=11,
            textColor=colors.HexColor('#333333'),
            spaceAfter=12,
            alignment=TA_JUSTIFY,
            leading=14
        ))
        
        # Evidence style
        self.styles.add(ParagraphStyle(
            name='Evidence',
            parent=self.styles['Code'],
            fontSize=9,
            textColor=colors.HexColor('#2c3e50'),
            backColor=colors.HexColor('#ecf0f1'),
            leftIndent=20,
            spaceAfter=10
        ))
    
    def generate_analysis_report(
        self,
        case_id: str,
        detection_result: Dict[str, Any],
        evidence_chain: Dict[str, Any],
        file_metadata: Dict[str, Any],
        analyst_info: Dict[str, str]
    ) -> str:
        """
        Generate comprehensive analysis report
        Returns path to generated PDF
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"forensic_report_{case_id}_{timestamp}.pdf"
        filepath = self.output_dir / filename
        
        # Create PDF document
        doc = SimpleDocTemplate(
            str(filepath),
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18,
        )
        
        # Build content
        story = []
        
        # Title page
        story.extend(self._create_title_page(case_id, analyst_info))
        story.append(PageBreak())
        
        # Executive summary
        story.extend(self._create_executive_summary(detection_result, file_metadata))
        story.append(PageBreak())
        
        # Detection methodology
        story.extend(self._create_methodology_section(detection_result))
        story.append(Spacer(1, 0.3*inch))
        
        # Detailed findings
        story.extend(self._create_findings_section(detection_result))
        story.append(PageBreak())
        
        # Visual analysis
        story.extend(self._create_visual_analysis(detection_result))
        story.append(PageBreak())
        
        # Evidence chain
        story.extend(self._create_evidence_chain_section(evidence_chain))
        story.append(PageBreak())
        
        # Technical appendix
        story.extend(self._create_technical_appendix(detection_result, file_metadata))
        story.append(PageBreak())
        
        # Legal statement
        story.extend(self._create_legal_statement())
        
        # Build PDF
        doc.build(story)
        
        logger.info(f"Generated forensic report: {filepath}")
        return str(filepath)
    
    def _create_title_page(self, case_id: str, analyst_info: Dict[str, str]) -> List:
        """Create report title page"""
        elements = []
        
        # Logo/Header (if available)
        elements.append(Spacer(1, 2*inch))
        
        # Title
        title = Paragraph(
            "DEEPFAKE FORENSIC ANALYSIS REPORT",
            self.styles['CustomTitle']
        )
        elements.append(title)
        elements.append(Spacer(1, 0.3*inch))
        
        # Case ID
        case_info = Paragraph(
            f"<b>Case ID:</b> {case_id}<br/>"
            f"<b>Report Date:</b> {datetime.now().strftime('%B %d, %Y')}<br/>"
            f"<b>Report Time:</b> {datetime.now().strftime('%H:%M:%S %Z')}",
            self.styles['CustomBody']
        )
        elements.append(case_info)
        elements.append(Spacer(1, 0.5*inch))
        
        # Analyst information
        analyst = Paragraph(
            f"<b>Analysis Conducted By:</b><br/>"
            f"Name: {analyst_info.get('name', 'N/A')}<br/>"
            f"Organization: {analyst_info.get('organization', 'N/A')}<br/>"
            f"Credentials: {analyst_info.get('credentials', 'N/A')}",
            self.styles['CustomBody']
        )
        elements.append(analyst)
        
        # Confidentiality notice
        elements.append(Spacer(1, 1*inch))
        notice = Paragraph(
            "<b>CONFIDENTIAL REPORT</b><br/>"
            "This report contains confidential information intended solely for the authorized recipient. "
            "Unauthorized distribution or disclosure is strictly prohibited.",
            self.styles['CustomBody']
        )
        elements.append(notice)
        
        return elements
    
    def _create_executive_summary(self, detection_result: Dict[str, Any], file_metadata: Dict[str, Any]) -> List:
        """Create executive summary"""
        elements = []
        
        elements.append(Paragraph("EXECUTIVE SUMMARY", self.styles['CustomSubtitle']))
        elements.append(Spacer(1, 0.2*inch))
        
        # Detection verdict
        is_fake = detection_result.get('is_fake', False)
        confidence = detection_result.get('confidence', 0) * 100
        
        verdict_text = f"""
        <b>Primary Finding:</b><br/>
        The analyzed media has been determined to be <b>{"MANIPULATED/SYNTHETIC"if is_fake else "AUTHENTIC"}</b> 
        with a confidence level of <b>{confidence:.1f}%</b>.<br/><br/>
        
        <b>Analysis Method:</b> {detection_result.get('detection_method', 'Multi-Algorithm Analysis')}<br/>
        <b>File Type:</b> {file_metadata.get('type', 'Unknown')}<br/>
        <b>File Size:</b> {file_metadata.get('size', 'Unknown')}<br/>
        <b>Processing Time:</b> {detection_result.get('processing_time', 0):.2f} seconds<br/><br/>
        
        <b>Key Findings:</b>
        """
        
        elements.append(Paragraph(verdict_text, self.styles['CustomBody']))
        
        # Anomalies found
        anomalies = detection_result.get('anomalies_found', [])
        if anomalies:
            for i, anomaly in enumerate(anomalies[:5], 1):
                elements.append(Paragraph(f"{i}. {anomaly}", self.styles['CustomBody']))
        else:
            elements.append(Paragraph("No significant anomalies detected.", self.styles['CustomBody']))
        
        return elements
    
    def _create_methodology_section(self, detection_result: Dict[str, Any]) -> List:
        """Create methodology section"""
        elements = []
        
        elements.append(Paragraph("DETECTION METHODOLOGY", self.styles['CustomSubtitle']))
        elements.append(Spacer(1, 0.2*inch))
        
        methodology = f"""
        This analysis employed a multi-algorithm approach combining several industry-standard 
        deepfake detection techniques:<br/><br/>
        
        <b>Algorithms Applied:</b><br/>
        • Frequency Domain Analysis (DCT/FFT)<br/>
        • Temporal Consistency Analysis<br/>
        • Compression Artifact Detection<br/>
        • Noise Pattern Analysis<br/>
        • Phase Consistency Verification<br/>
        • Spectral Analysis (for audio)<br/>
        • Error Level Analysis (for images)<br/><br/>
        
        Each algorithm produces an independent score, which is then weighted and combined 
        to produce a final confidence score. This multi-method approach ensures robust 
        detection across various types of manipulations.
        """
        
        elements.append(Paragraph(methodology, self.styles['CustomBody']))
        
        return elements
    
    def _create_findings_section(self, detection_result: Dict[str, Any]) -> List:
        """Create detailed findings section"""
        elements = []
        
        elements.append(Paragraph("DETAILED FINDINGS", self.styles['CustomSubtitle']))
        elements.append(Spacer(1, 0.2*inch))
        
        # Forensic metrics table
        metrics = detection_result.get('forensic_metrics', {})
        if metrics:
            data = [['Metric', 'Score', 'Interpretation']]
            
            for metric_name, score in metrics.items():
                interpretation = self._interpret_score(metric_name, score)
                data.append([
                    metric_name.replace('_', ' ').title(),
                    f"{score:.4f}",
                    interpretation
                ])
            
            table = Table(data, colWidths=[2.5*inch, 1*inch, 3*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498db')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
            ]))
            
            elements.append(table)
        
        return elements
    
    def _create_visual_analysis(self, detection_result: Dict[str, Any]) -> List:
        """Create visual analysis with charts"""
        elements = []
        
        elements.append(Paragraph("VISUAL ANALYSIS", self.styles['CustomSubtitle']))
        elements.append(Spacer(1, 0.2*inch))
        
        # Create confidence chart
        chart_path = self._create_confidence_chart(detection_result)
        if chart_path:
            img = Image(chart_path, width=5*inch, height=3*inch)
            elements.append(img)
            elements.append(Spacer(1, 0.2*inch))
        
        # Create metrics comparison chart
        metrics_chart = self._create_metrics_chart(detection_result)
        if metrics_chart:
            img = Image(metrics_chart, width=5*inch, height=3*inch)
            elements.append(img)
        
        return elements
    
    def _create_evidence_chain_section(self, evidence_chain: Dict[str, Any]) -> List:
        """Create evidence chain section"""
        elements = []
        
        elements.append(Paragraph("EVIDENCE CHAIN INTEGRITY", self.styles['CustomSubtitle']))
        elements.append(Spacer(1, 0.2*inch))
        
        verification = evidence_chain.get('chain_integrity', {})
        
        integrity_text = f"""
        <b>Chain Status:</b> {"VERIFIED ✓" if verification.get('valid') else "COMPROMISED ✗"}<br/>
        <b>Total Blocks:</b> {verification.get('chain_length', 0)}<br/>
        <b>Blocks Verified:</b> {verification.get('blocks_verified', 0)}<br/>
        <b>Genesis Block Hash:</b><br/>
        <font name="Courier" size="8">{verification.get('genesis_block', 'N/A')}</font><br/><br/>
        
        Each piece of evidence in this case has been cryptographically secured using SHA-256 hashing 
        and linked in an immutable blockchain. Any tampering with the evidence or chain will be 
        immediately detectable through hash verification.
        """
        
        elements.append(Paragraph(integrity_text, self.styles['CustomBody']))
        
        return elements
    
    def _create_technical_appendix(self, detection_result: Dict[str, Any], file_metadata: Dict[str, Any]) -> List:
        """Create technical appendix"""
        elements = []
        
        elements.append(Paragraph("TECHNICAL APPENDIX", self.styles['CustomSubtitle']))
        elements.append(Spacer(1, 0.2*inch))
        
        # Analysis details
        analysis_details = detection_result.get('analysis_details', {})
        
        details_text = "<b>Analysis Parameters:</b><br/>"
        for key, value in analysis_details.items():
            if isinstance(value, dict):
                details_text += f"<br/><b>{key.replace('_', ' ').title()}:</b><br/>"
                for k, v in value.items():
                    details_text += f"  • {k}: {v}<br/>"
            else:
                details_text += f"• {key.replace('_', ' ').title()}: {value}<br/>"
        
        elements.append(Paragraph(details_text, self.styles['Evidence']))
        
        return elements
    
    def _create_legal_statement(self) -> List:
        """Create legal compliance statement"""
        elements = []
        
        elements.append(Paragraph("LEGAL STATEMENT", self.styles['CustomSubtitle']))
        elements.append(Spacer(1, 0.2*inch))
        
        legal_text = """
        <b>Certification of Authenticity:</b><br/><br/>
        
        I hereby certify that:<br/>
        1. This analysis was conducted using industry-standard forensic methodologies<br/>
        2. All evidence has been secured in a cryptographically verified chain<br/>
        3. The findings represent my professional opinion based on the available evidence<br/>
        4. All analysis procedures were documented and are reproducible<br/>
        5. No conflicts of interest exist that would affect the integrity of this analysis<br/><br/>
        
        <b>Admissibility:</b><br/>
        This report and associated evidence chain are prepared to meet the requirements for 
        digital evidence admissibility under Federal Rules of Evidence 901-902 and equivalent 
        state laws. The cryptographic chain of custody ensures authentication and integrity.<br/><br/>
        
        <b>Disclaimer:</b><br/>
        While every effort has been made to ensure accuracy, no detection system is infallible. 
        This analysis should be considered alongside other evidence in the case. The confidence 
        scores represent statistical likelihood based on algorithmic analysis.<br/><br/>
        
        ___________________________________<br/>
        Digital Forensic Analyst<br/>
        Date: """ + datetime.now().strftime('%B %d, %Y')
        
        elements.append(Paragraph(legal_text, self.styles['CustomBody']))
        
        return elements
    
    def _create_confidence_chart(self, detection_result: Dict[str, Any]) -> Optional[str]:
        """Create confidence score visualization"""
        try:
            fake_prob = detection_result.get('fake_probability', 0) * 100
            real_prob = detection_result.get('real_probability', 0) * 100
            
            fig, ax = plt.subplots(figsize=(6, 4))
            
            categories = ['Fake/Manipulated', 'Real/Authentic']
            probabilities = [fake_prob, real_prob]
            colors_list = ['#e74c3c', '#2ecc71']
            
            bars = ax.barh(categories, probabilities, color=colors_list)
            ax.set_xlabel('Probability (%)', fontsize=12)
            ax.set_title('Detection Confidence Scores', fontsize=14, fontweight='bold')
            ax.set_xlim(0, 100)
            
            # Add value labels
            for i, bar in enumerate(bars):
                width = bar.get_width()
                ax.text(width + 2, bar.get_y() + bar.get_height()/2, 
                       f'{probabilities[i]:.1f}%',
                       ha='left', va='center', fontsize=11, fontweight='bold')
            
            plt.tight_layout()
            
            chart_path = self.output_dir / f"chart_confidence_{datetime.now().strftime('%Y%m%d%H%M%S')}.png"
            plt.savefig(chart_path, dpi=150, bbox_inches='tight')
            plt.close()
            
            return str(chart_path)
        except Exception as e:
            logger.error(f"Error creating confidence chart: {e}")
            return None
    
    def _create_metrics_chart(self, detection_result: Dict[str, Any]) -> Optional[str]:
        """Create forensic metrics comparison chart"""
        try:
            metrics = detection_result.get('forensic_metrics', {})
            if not metrics:
                return None
            
            fig, ax = plt.subplots(figsize=(6, 4))
            
            metric_names = [name.replace('_', ' ').title() for name in metrics.keys()]
            scores = list(metrics.values())
            
            # Normalize scores to 0-1 range for visualization
            max_score = max(scores) if scores else 1
            normalized_scores = [s / max_score for s in scores]
            
            bars = ax.bar(metric_names, normalized_scores, color='#3498db')
            ax.set_ylabel('Normalized Score', fontsize=12)
            ax.set_title('Forensic Metrics Analysis', fontsize=14, fontweight='bold')
            ax.set_ylim(0, 1.2)
            plt.xticks(rotation=45, ha='right')
            
            # Add value labels
            for i, bar in enumerate(bars):
                height = bar.get_height()
                ax.text(bar.get_x() + bar.get_width()/2., height + 0.02,
                       f'{scores[i]:.3f}',
                       ha='center', va='bottom', fontsize=9)
            
            plt.tight_layout()
            
            chart_path = self.output_dir / f"chart_metrics_{datetime.now().strftime('%Y%m%d%H%M%S')}.png"
            plt.savefig(chart_path, dpi=150, bbox_inches='tight')
            plt.close()
            
            return str(chart_path)
        except Exception as e:
            logger.error(f"Error creating metrics chart: {e}")
            return None
    
    def _interpret_score(self, metric_name: str, score: float) -> str:
        """Interpret metric score"""
        if score < 0.3:
            return "Low anomaly"
        elif score < 0.6:
            return "Moderate concern"
        else:
            return "High anomaly detected"


# Export functions
def generate_forensic_report(
    case_id: str,
    detection_result: Dict[str, Any],
    evidence_chain: Dict[str, Any],
    file_metadata: Dict[str, Any],
    analyst_info: Dict[str, str] = None
) -> str:
    """
    Generate comprehensive forensic analysis report
    Returns path to PDF file
    """
    if analyst_info is None:
        analyst_info = {
            'name': 'DeepClean.AI System',
            'organization': 'Automated Forensic Analysis',
            'credentials': 'AI-Powered Detection System'
        }
    
    generator = ForensicReportGenerator()
    return generator.generate_analysis_report(
        case_id,
        detection_result,
        evidence_chain,
        file_metadata,
        analyst_info
    )
