import * as React from "react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DefaultButton } from "office-ui-fabric-react";

interface ExportToExcelRendererProps {
    items: any[];
}

export class ExportToExcelRenderer extends  React.Component<ExportToExcelRendererProps, {}> {
    private _workbook: XLSX.WorkBook;
    private columns: any[];

    public constructor(props) {        
        super(props);

        this._workbook = XLSX.utils.book_new();
        this._handleClickExport = this._handleClickExport.bind(this);

        //prépare XSLX exporting
        this.columns = this._generateColumns();
    }

    public componentDidMount() : void {
        //this.loadData();
        
    }

     public render() {
        return (
            <DefaultButton text={"Export Excel"} iconProps={{iconName: 'ExcelDocument' }} onClick={this._handleClickExport} />
        );
    }

    private _handleClickExport = (ev): void => {
        const { items } = this.props;
        const today = new Date(Date.now());
        const fileNameExp = `export_${this._formatDate(today)}.xlsx`;
        const colHeaders = this._createColHeaders(this.columns);
        const transformedItems = this._mapProperties(items,this.columns);

        // Create the sheet.
        const sheet = XLSX.utils.json_to_sheet(colHeaders.headers, {
            skipHeader: true
        });
        XLSX.utils.sheet_add_json(sheet, transformedItems, {
            skipHeader: true,
            origin: 'A2'
        });

        if (!this._workbook.Sheets['Feuil1']) {
            XLSX.utils.book_append_sheet(this._workbook, sheet, 'Feuil1');
        }

        //sauvegarde XSLX
        //XLSX.writeFile(this._workbook,fileNameExp,{ bookType: 'xlsx', type: 'buffer', bookSST: false});

        //sauvegarde
        const buffer: any =  XLSX.write(this._workbook, {bookType:"xlsx", type:'array'});
        this.saveAsExcelFile(buffer,fileNameExp);
    }
   

    private _createColHeaders = (columns: Array<any>): { headers: Array<any>, cols: string } => {
        let headers = [{}];
        let cols = '';

        // Create the column headers.
        columns.forEach((element, index) => {
            headers[0][element.key] = element.name;

            if (index == 0) {
                cols += XLSX.utils.encode_col(index);
            }
            else if (index == columns.length - 1) {
                cols += ':' + XLSX.utils.encode_col(index);
            }
        });

        return {
            headers: headers,
            cols: cols
        };
    }

    private _formatDate = (date: Date): string => {
        return `${date.getDay()}_${date.getMonth()}_${date.getFullYear()}`;
    }

    private _mapProperties = (items: Array<any>, columns: Array<any>): Array<any> => {
        // Select properties to display.
        return items.map(e => {
            let o = {};
            columns.forEach(c => {
                // Check if the property is a date then return it as string.
                if (e[c.key] instanceof Date) {
                    o[c.key] = (e[c.key] as Date).toLocaleDateString("fr");
                }
                else {
                    o[c.key] = e[c.key];
                }
            });

            return o;
        });
    }

    private _generateColumns = (): Array<any> => {
        return [
            {
                key: 'Title',
                name: 'Titre'
            },
          {
            key: 'MyFood_CultureType',
            name: 'Type Culture'
          },
          {
            key: 'MyFood_CultureDate',
            name: 'Date de culture'
          },
          {
            key: 'MyFood_ZipGrowID',
            name: 'Identifiant ZipGrow'
          },
          {
            key: 'MyFood_zipGrowType',
            name: 'Type ZipGrow'
          },
          {
            key: 'MyFood_SerreType',
            name: 'Cultivé en'
          }
        ];
      }

    private saveAsExcelFile(buffer: any,fileNameExp): void {
        const data: Blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        });
        saveAs(data,fileNameExp);
      }
}

