import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PnClienteService } from '../../../../services/admin/pn-cliente/pn-cliente.service';
import { LoginService } from '../../../../services/login/login.service';
import { LoginAdminService } from '../../../../services/admin/login/login-admin.service';
import { PnFinanceiroService } from '../../../../services/admin/pn-financeiro/pn-financeiro.service';
import { PnRelatoriosService } from '../../../../services/admin/pn-relatorios/pn-relatorios.service';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-pn-relatorios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pn-relatorios.component.html',
  styleUrl: './pn-relatorios.component.css'
})
export class PnRelatoriosComponent {
  clientes!: any;
  cliPendente!: any;
  optioncli: any = '';
  estatisticas!: any;
  cliselect!: any;
  func: any;
  idfunc: any;

  constructor(private Scli: PnClienteService, private loginservice: LoginAdminService,
    private cadservice: PnFinanceiroService, private pestatistica: PnRelatoriosService,
    private alertas: ToastrService) {
    this.pesquisarCliPendente();
    this.pClientes();
    this.funcao();
    this.idfunc = localStorage.getItem('adminid');
  }



  pClientes() {
    this.Scli.pesquisar().subscribe(
      (dado) => {
        // console.log('Dados recebidos:', dado);
        this.cliselect = dado;
        this.clientes = dado;

      },
      (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    );
  }

  gerarPdf() {
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Capturar o conteúdo HTML para uma imagem usando html2canvas
    const content = document.getElementById("cli-ai");
    if (content) {
      html2canvas(content).then(canvas => {
        const imgWidth = 180;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        // Adicionar o texto antes da imagem
        pdf.setFontSize(18);
        pdf.text('Relatório de Clientes ativos e inativos', 20, 10);

        const contentDataURL = canvas.toDataURL('image/png');

        // Adiciona a imagem capturada ao PDF
        pdf.addImage(contentDataURL, 'PNG', 10, 20, imgWidth, imgHeight);


        // Salva o PDF
        pdf.save('Relatorio-clientes-ativos-inativos.pdf');
      });
    }


  }

  gerarPdfP() {
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Capturar o conteúdo HTML para uma imagem usando html2canvas
    const content = document.getElementById("cli-pagp");
    if (content) {
      html2canvas(content).then(canvas => {
        const imgWidth = 180;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        // Adicionar o texto antes da imagem
        pdf.setFontSize(18);
        pdf.text('Relatório de Clientes Com Pagamentos Pendentes', 20, 10);

        const contentDataURL = canvas.toDataURL('image/png');

        // Adiciona a imagem capturada ao PDF
        pdf.addImage(contentDataURL, 'PNG', 10, 20, imgWidth, imgHeight);


        // Salva o PDF
        pdf.save('Relatorio-clientes.pdf');
      });
    }
  }

  gerarPdfPe() {
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Capturar o conteúdo HTML para uma imagem usando html2canvas
    const content = document.getElementById("cli-pE");
    if (content) {
      html2canvas(content).then(canvas => {
        const imgWidth = 180;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        // Adicionar o texto antes da imagem
        pdf.setFontSize(18);
        pdf.text('Relatório de Estátistica do cliente', 20, 10);

        const contentDataURL = canvas.toDataURL('image/png');

        // Adiciona a imagem capturada ao PDF
        pdf.addImage(contentDataURL, 'PNG', 10, 20, imgWidth, imgHeight);


        // Salva o PDF
        pdf.save('Relatorio-clientes.pdf');
      });
    }

  }
  gerarPdfVenda() {
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Capturar o conteúdo HTML para uma imagem usando html2canvas
    const content = document.getElementById("venda");
    if (content) {
      html2canvas(content).then(canvas => {
        const imgWidth = 180;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        // Adicionar o texto antes da imagem
        pdf.setFontSize(18);
        pdf.text('Relatório de Venda', 20, 10);

        const contentDataURL = canvas.toDataURL('image/png');

        // Adiciona a imagem capturada ao PDF
        pdf.addImage(contentDataURL, 'PNG', 10, 20, imgWidth, imgHeight);


        // Salva o PDF
        pdf.save('Relatorio-Venda.pdf');
      });
    }

  }

  Clientes() {
    this.Scli.pesquisar().subscribe(
      (dado) => {
        // console.log('Dados recebidos:', dado);
        this.cliselect = dado;
        this.clientes = dado;
      },
      (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    );
  }

  pesquisarEstatisticas() {
    const jsonString: string = '{"cliente_id": "' + this.optioncli + '"}';
    this.pestatistica.pesquisarEstatisticas(jsonString).subscribe({
      next: (dados) => {
        this.estatisticas = dados;
        console.log(dados);
        if (this.estatisticas == '') {
          this.alertas.error('cliente não possui treinos', 'error')
        } else {
          this.alertas.success('Busca Realizada!', 'Sucesso')
        }
      },
    })
  }

  pesquisarCliPendente() {
    // this.cadservice.pesquisarCliPendente().subscribe(
    //   (dado) => {
    //     // console.log('Dados recebidos:', dado);
    //     this.cliPendente = dado;

    //   },
    //   (erro) => {
    //     console.error('Erro ao buscar dados:', erro);
    //   }
    // );
  }

  funcao() {
    const jsonString: string = '{"id": "' + localStorage.getItem('id') + '"}';
    this.loginservice.funcaoCliente(jsonString).subscribe(
      (dado) => {
        this.func = dado[0].funcao;
      },
      (erro) => {
        console.error('Erro ao buscar dados:', erro);
      }
    );
  }

}

