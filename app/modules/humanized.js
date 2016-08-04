(function() {
  "use strict";

  angular
    .module("segue.admin.humanized", [ 'segue.admin' ])
    .constant("HumanizedStrings", {
       'business':          'corporativo',
       'caravan':           'caravanista',
       'caravan-leader':    'líder de caravana',
       'foreigner':         'estrangeiro',
       'foreigner-student': 'estrangeiro estudante',
       'government':        'empenho',
       'normal':            'individual',
       'promocode':         'código promocional',
       'proponent':         'proponente',
       'proponent-student': 'proponente estudante',
       'speaker':           'palestrante',
       'student':           'Estudante',

        // disability types
        'none':     'Não',
        'physical': 'Física',
        'hearing':  'Auditiva',
        'visual':   'Visual',
        'mental':   'Mental',

        //proposal status
        'confirmed': 'Confirmado',
        'declined': 'Rejeitado',

        // status
        'paid': 'Pago',
        'pending': 'Pendente',

        //purchase status
        'student_document_in_analysis':'Vínculo estudantil aguardando análise',
        'gov_document_submission_pending':'Aguardando submissão da nota de empenho',
        'gov_document_in_analysis': 'Nota de empenho aguardando análise',

        // ocupation types
        //'student': 'Estudante',
        'private_employee': 'Funcionário',
        'public_employee': 'Funcionário Público',
        'businessman': 'Empresário',
        'freelancer': 'Autônomo',

        // education
        'post_graduation_stricto': 'Mestrado/Doutorado',
        'post_graduation_lato': 'Pós Graduação/Especialização',
        'graduation': 'Ensino Superior Completo',
        'graduation_incomplete': 'Ensino Superior Incompleto',
        'secondary': 'Ensino Médio Completo',
        'secondary_incomplete': 'Ensino Médio Incompleto',

        // proposal types
        'workshop': 'oficina',
        'talk': 'palestra'

    });
})();
