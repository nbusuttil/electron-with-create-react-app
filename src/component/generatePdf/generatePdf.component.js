import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { values, map, dropRight, drop, findLast, split } from 'lodash';

// Libs
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { styles, headerStyles, margin } from '../../utils/stylesOutput.utils';
import { prepareConsultation, prepareCharge } from '../../utils/prepareLayout.utils';
import { getRevenue, getExpenses } from '../../utils/algorithm.utils';
import monthToString from '../../utils/month.utils';
import iconPdf from '../../icons/pdf.svg';

const headers = ['Date', 'Patient', 'Consulation', 'Moyen de paiement', 'Règlement'];

class GeneratePdf extends Component {
  getDate() {
    const { consultations, filtering } = this.props;
    const getDate = findLast(prepareConsultation(consultations, filtering), 'date');
    const date = split(getDate && getDate.date, '-', 3);
    const month = date[1];
    const year = date[0];

    return `${monthToString(month)}-${year}`;
  }

  showRevenue = () => getRevenue(prepareConsultation(this.props.consultations, this.props.filtering));

  showCharges = () => prepareCharge(this.props.charges, this.props.filtering);

  showExpenses = () => getExpenses(this.showCharges());

  showBenefit = () => this.showRevenue() - this.showExpenses();

  downloadPdf = () => {
    const { consultations, filtering } = this.props;
    const newPdf = new jsPDF('p', 'pt');

    const gridConsultations = map(prepareConsultation(consultations, filtering), consultation => {
      const arrayConsultation = values(consultation);
      const dropIndex = drop(arrayConsultation);

      return dropRight(dropIndex, 2);
    });

    newPdf.autoTable(headers, gridConsultations, {
      styles,
      headerStyles,
      margin,
      addPageContent: () => {
        newPdf.setTextColor(159, 143, 117);
        newPdf.setFontSize(16);
        newPdf.text(`Bilan ${this.getDate()}`, 40, 40);
        newPdf.setTextColor(0, 0, 0);
        newPdf.setFontSize(12);
        newPdf.text(`Recette: ${this.showRevenue()} €`, 40, 80);
        newPdf.text(`Charges: ${this.showExpenses()} €`, 150, 80);
        newPdf.text(`Bénéfice: ${this.showBenefit()} €`, 300, 80);
      },
    });

    newPdf.save(`bilan-cabinet_du_${this.getDate()}.pdf`);
  };

  render() {
    console.log('###', this.showRevenue(), this.showExpenses(), this.showBenefit());
    return (
      <div>
        <button onClick={this.downloadPdf}>
          <img src={iconPdf} alt="pdf" className="icons icons--pdf" />
        </button>
      </div>
    );
  }
}

GeneratePdf.propTypes = {
  consultations: PropTypes.object.isRequired,
  filtering: PropTypes.object.isRequired,
};

export default GeneratePdf;