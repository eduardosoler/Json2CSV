import { iCSVToken } from "./token";

export class CSV {
  //Matrix de valores
  private _matrix: iCSVToken[][] = [];

  //Adiciona objeto no controlador matriz
  addObject(obj: any) {
    this._matrix.push(this.fromObject(obj));
  }

  //adiciona array no controlador matriz
  addArray(obj: any[]) {
    this._matrix.push(...obj.map(x => this.fromObject(x)))
  }

  //Processo de converter objeto em array de valores
  private fromObject(obj: any, prefix?: string): iCSVToken[] {
    let temp: iCSVToken[] = [];
    for (let prop in obj)
      //Caso propriedade seja um objeto agir recursivamente para adicionar as propriedades no objeto pai
      if (obj[prop] instanceof Object) {
        temp.push(...this.fromObject(obj[prop]))
      } else
      //Caso seja um tipo primitivo add prefix caso tenha e valor
        temp.push(new CSVToken(`${prefix ? prefix + '.' : ''}${prop}`, "" + obj[prop]));

    return temp;
  }

  //Converter em CSV através do controlador matriz
  toString(): string;
  toString(showHeaders: boolean): string;
  toString(showHeaders?: Boolean) {
    //Se for pra mostrar o cabeçalho acrescentar mais um registro no indice 0
    if (showHeaders) {
      this._matrix = [this._matrix[0].map(x => new CSVToken(x.chave, x.chave)), ...this._matrix]
    }

    return this._matrix
      //Map por linha, separando valores por ;
      .map(x => x.map(y => y.valor).join(";"))
      //Separar as linhas por quebras
      .join("\r\n");
  }
}

//Objeto que irá representar os valores de cada posição do CSV
class CSVToken implements iCSVToken {
  chave: string;
  valor: string;

  constructor(chave: string, valor: string) {
    this.chave = chave;
    this.valor = valor;
  }
}
